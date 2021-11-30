import React from 'react';
import styled from "styled-components";

const PreloaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 600px
`

const ErrorPreloader = (props) => {
    return (
        <PreloaderWrapper>
            <img src={require('../../assets/error.gif').default}/>
        </PreloaderWrapper>
    );
}

export default ErrorPreloader;