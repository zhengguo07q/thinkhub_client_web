
import React from 'react';
import { Avatar } from '@alifd/next';
import styles from './index.module.scss';

const RegisterAvatar = (props) => {
    const {avatar} = props;
    return (
        <div className={styles.headerAvatar}>
            <a href='login'>
                <Avatar size="small" src={avatar} alt="用户头像" />
            </a>
        </div>
    );
};

RegisterAvatar.defaultProps = {
    avatar: 'https://img.alicdn.com/tfs/TB1.ZBecq67gK0jSZFHXXa9jVXa-904-826.png',
};

export default RegisterAvatar;