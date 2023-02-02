import React, { Fragment, useEffect, useState } from 'react';
import { Row, Col as ACol, Divider, Typography } from 'antd';
import { MessageBus } from '@ivoyant/component-message-bus';
import BreadCrumb from '@ivoyant/component-breadcrumb';
import JsxParser from 'react-jsx-parser';
import jsonata from 'jsonata';
import { useLocation } from 'react-router-dom';
import shortid from 'shortid';
import './styles.css';

const onStateChange = (
    setDelayedData,
    setTransitionedTo,
    interestedStates,
    dataExp
) => (subscriptionId, topic, eventData, closure) => {
    if (eventData) {
        if (interestedStates && interestedStates.includes(eventData.value)) {
            setDelayedData(
                dataExp
                    ? jsonata(dataExp).evaluate(eventData)
                    : eventData?.event?.data?.data
            );
            setTransitionedTo(eventData.value);
        }
    }
};

const getDivider = (dividerConf) => {
    let divider;
    if (dividerConf) {
        divider = (
            <Divider
                orientation={dividerConf.orientation || 'left'}
                type={dividerConf.type || 'horizontal'}
            >
                {dividerConf.text}
            </Divider>
        );
    }
    return divider;
};

const Col = React.memo((props) => {
    const { col, getRow, workflow, getChildForId } = props;

    const {
        row,
        id,
        dividerBefore,
        dividerAfter,
        enableOnEvents,
        disableOnEvents,
        delayedDataExp,
        className = 'gutter-row',
        span = 24,
        jsxBefore,
        jsxAfter,
    } = col;
    const [enabled,setEnabled] = useState(enableOnEvents === undefined);
    const [transitionedTo, setTransitionedTo] = useState(undefined);
    const [delayedData, setDelayedData] = useState({});
    const location = useLocation();

    useEffect(() => {
        if (id && workflow && (enableOnEvents || disableOnEvents)) {
            console.log(
                'Subscribing to id ',
                workflow.concat('.col').concat('.').concat(id)
            );
            MessageBus.subscribe(
                workflow.concat('.col').concat('.').concat(id),
                'WF.'.concat(workflow).concat('.STATE.CHANGE'),
                onStateChange(
                    setDelayedData,
                    setTransitionedTo,
                    [...(enableOnEvents || []),...(disableOnEvents || [])],
                    delayedDataExp
                )
            );
        }

        return () => {
            if (id && workflow && (enableOnEvents || disableOnEvents)) {
                MessageBus.unsubscribe(
                    workflow.concat('.col').concat('.').concat(id)
                );
            }
        };
    }, []);

    useEffect(() => {
        if(transitionedTo) {
            if(enableOnEvents) {
                if(enableOnEvents.includes(transitionedTo)) {
                    setEnabled(true);
                } 
             } 
             if(disableOnEvents) {
                 if(disableOnEvents.includes(transitionedTo)) {
                     setEnabled(false);
                 }
             }
        }        
    }, [transitionedTo]);

    return (
        <Fragment key={id || shortid.generate()}>
            {dividerBefore && getDivider(dividerBefore)}
            <ACol span={span} className={className}>
                {enabled &&
                    (row ? (
                        getRow(row)
                    ) : (
                        <div>
                            {jsxBefore && (
                                <JsxParser
                                    bindings={{
                                        routeData: location?.state?.routeData,
                                        routeContext: location?.state?.routeContext,
                                    }}
                                    components={{
                                        Title: Typography.Title,
                                        Paragraph: Typography.Paragraph,
                                        Text: Typography.Text,
                                    }}
                                    jsx={jsxBefore}
                                />
                            )}
                            {getChildForId(id, delayedData)}
                        </div>
                    ))}
            </ACol>
            {dividerAfter && getDivider(dividerAfter)}
        </Fragment>
    );
}, true);

export default function Grid(props) {
    const { children, properties } = props;
    const { childComponents, params } = props.component;
    const {title,breadcrumbs} = params;

    let {
        gutter = { xs: 8, sm: 16, md: 24, lg: 32 },
        workflow,
        initialize,
    } = properties;
    if (!Array.isArray(gutter)) {
        gutter = [gutter, 16];
    }

    const getChildForId = (id, delayedData) => {
        let child = <></>;
        if (id) {
            child = React.cloneElement(
                children[childComponents.findIndex((cc) => cc.id === id)],
                {
                    parentProps: props,
                    routeData: props?.routeData,
                    routeContext: props?.routeContext,
                    delayedData,
                }
            );
        }

        return child;
    };

    useEffect(() => {
        if (workflow) {
            if (initialize) {
                MessageBus.send('WF.'.concat(workflow).concat('.INIT'), {
                    header: {
                        registrationId: workflow,
                        workflow,
                        eventType: 'INIT',
                    },
                });
            }
        }
    }, []);

    const getCols = (cols) => {
        return cols.map((col) => {
            return (
                <Col
                    col={col}
                    getRow={getRow}
                    workflow={workflow}
                    getChildForId={getChildForId}
                />
            );
        });
    };

    const getRow = (row) => {
        return (
            <Fragment key={shortid.generate()}>
                {getDivider(row.dividerBefore)}
                <Row
                    gutter={row.gutter || gutter}
                    justify={row.justify || 'start'}
                >
                    {getCols(row.cols)}
                </Row>
                {getDivider(row.dividerAfter)}
            </Fragment>
        );
    };

    const getRows = (rows) => {
        return (
            <>
                {breadcrumbs && title && (
                    <BreadCrumb title={title} breadcrumbs={breadcrumbs} />
                )}
                {rows.map((row) => {
                    return getRow(row);
                })}
            </>
        );
    };

    return <>{getRows(params.rows)}</>;
}
