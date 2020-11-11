import React, { Component } from 'react';
import styles from './index.module.scss';

export default class Footer extends Component {
    render(){
       return (<p className={styles.footer} ref='footerRef'>
        <span className={styles.logo}>Thinkhub</span>
        <br/>
        <span className={styles.copyright}>© 2020-2021 Thinkhub Fusion</span>
      </p>
    );
    }

}