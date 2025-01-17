"use client"
import React, { useEffect } from 'react'
import config from '../../public/config.json'
function Logger() {
    useEffect(() => {
        console.info(
          `${config.ascii}\n`,
          `Taking a peek huh? Check out the source code: ${config.repo}\n\n`
        );
      }, []);
  
}

export default Logger