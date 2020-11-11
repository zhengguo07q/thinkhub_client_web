import React, { Component } from 'react';
import Login from './components/Login';
import { SizeContext } from '../../layouts/BasicLayout/index'

export default function () {
    return (
        <SizeContext.Consumer>
            {size => (
            <div className="Login-page" style={{height: size.height}}>
                <Login />
            </div>)}
        </SizeContext.Consumer>
    );
}
