import React from 'react';
import { Card, Button, Box } from '@alifd/next';

export default function () {
    const commonProps = {
        title: 'Title',
        style: { width: 300 },
        subTitle: 'Sub-title',
        extra: <Button text type="primary">Link</Button>,
    };

    return (
        <Card free style={{ width: 300 }}>
            <Card.Header title="Simple Card" {...commonProps} />
            <Card.Divider />
            <Card.Content>

</Card.Content>
            <Card.Divider />
            <Card.Actions>
                <Button type="primary" key="action1" text>Action 1</Button>
                <Button type="primary" key="action2" text>Action 2</Button>
            </Card.Actions>
        </Card>
    );
}
