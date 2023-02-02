/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React, { Fragment, useState, useEffect } from 'react';
import { Divider as ADivider, Col as ACol, Row as ARow } from 'antd';
import shortid from 'shortid';
import { MessageBus } from '@ivoyant/component-message-bus';
import onStateChange from './helper.js';

import './styles.css';

const getChildForId = (
    id,
    children,
    childComponents,
    parentProps,
    routeData,
    delayedData
) => {
    let child = <></>;
    if (id) {
        child = React.cloneElement(
            children[childComponents.findIndex((cc) => cc.id === id)],
            {
                parentProps,
                routeData,
                delayedData,
            }
        );
    }

    return child;
};

export function Divider({ orientation = 'left', type = 'horizontal', text }) {
    return (
        <ADivider orientation={orientation} type={type}>
            {text}
        </ADivider>
    );
}

export function Row(props) {
    let { gutter = { xs: 8, sm: 16, md: 24, lg: 32 } } = props;

    if (!Array.isArray(gutter)) {
        gutter = [gutter, 16];
    }

    const {
        dividerAfter,
        dividerBefore,
        justify = 'start',
        cols,
        workflow,
        children,
        childComponents,
        parentProps,
        routeData,
    } = props;

    return (
        <Fragment key={shortid.generate()}>
            {dividerBefore && <Divider {...dividerBefore} />}
            <ARow gutter={gutter} justify={justify}>
                {cols.map((col) => (
                    <Col
                        {...col}
                        workflow={workflow}
                        children={children}
                        childComponents={childComponents}
                        parentProps={props}
                        routeData={routeData}
                    />
                ))}
            </ARow>
            {dividerAfter && <Divider {...dividerAfter} />}
        </Fragment>
    );
}

const Col = React.memo((props) => {
    const {
        workflow,
        children,
        childComponents,
        parentProps,
        routeData,
        row,
        id,
        dividerBefore,
        dividerAfter,
        enableOnEvents,
        className = 'gutter-row',
        span = 24,
    } = props;
    const [transitionedTo, setTransitionedTo] = useState(undefined);

    useEffect(() => {
        if (id && workflow) {
            MessageBus.subscribe(
                workflow.concat('.col').concat('.').concat(id),
                'WF.'.concat(workflow).concat('.STATE.CHANGE'),
                onStateChange(setTransitionedTo)
            );
        }

        return () => {
            if (id && workflow) {
                MessageBus.unsubscribe(
                    workflow.concat('.col').concat('.').concat(id)
                );
            }
        };
    }, []);

    return (
        <Fragment key={id || shortid.generate()}>
            {dividerBefore && <Divider {...dividerBefore} />}
            <ACol span={span} className={className}>
                {(enableOnEvents === undefined ||
                    enableOnEvents.includes(transitionedTo)) &&
                    (row ? (
                        <Row
                            {...row}
                            workflow={workflow}
                            children={children}
                            childComponents={childComponents}
                            parentProps={props}
                            routeData={routeData}
                        />
                    ) : (
                        <div>
                            {getChildForId(
                                id,
                                children,
                                childComponents,
                                parentProps,
                                routeData,
                                enableOnEvents === undefined
                                    ? {}
                                    : {
                                          question:
                                              'WHich was your first concert',
                                      }
                            )}
                        </div>
                    ))}
            </ACol>
            {dividerAfter && <Divider {...dividerAfter} />}
        </Fragment>
    );
}, true);
