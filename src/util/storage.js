"use strict";
import React, { Component } from "react";
import { Dimensions, PixelRatio, AsyncStorage } from "react-native";

var queryString = require("query-string");
var CryptoJS = require("crypto-js");
var ethers = require("ethers");

module.exports = {

  setData(walletData) {
    console.log("AsyncStorage start");
    AsyncStorage.setItem("data", JSON.stringify(walletData));
    console.log(walletData);
    console.log("AsyncStorage save success!");
  },

  getData(dataName) {
    AsyncStorage.getItem(dataName)
      .then((data) => {
        console.log(data);
        if (data) {
          var walletData = JSON.parse(data);
          if (walletData.address && walletData.privateKey) {
            this.setState({
              logined: true,
              walletData: walletData
            });
          }
        } else {
          this.setState({
            logined: false
          });
        }
        return data;
      });

  }
};
