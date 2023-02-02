const onStateChange = (setTransitionedTo) => (
    subscriptionId,
    topic,
    eventData,
    closure
) => {
    if (eventData) {
        setTransitionedTo(eventData.value);
    }
};

export default onStateChange;
