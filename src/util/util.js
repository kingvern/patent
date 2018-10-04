"use strict";
import React, { Component } from "react";
import { Dimensions, PixelRatio, AsyncStorage } from "react-native";

var queryString = require("query-string");
var CryptoJS = require("crypto-js");

module.exports = {

  //device
  size: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width
  },

  pixel: 1 / PixelRatio.get(),


  //request
  get(url, param) {
    if (param) {
      url += "?" + queryString(param);
    }
    return fetch(url)
      .then((response) => response.json());
  },

  post(url, param) {
    return fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(param)
    })
      .then((response) => response.json());
  },


  //wallet
  balance: -1,
  txHash: "",

  getBalance(wallet) {
    var balancePromise = wallet.getBalance();
    balancePromise.then((balanceRaw) => {
      var balance = parseInt(balanceRaw) / 1e18;
      return balance;

    });

  },

  sendTx(fromWallet, toAddress, value) {
    var amount = ethers.utils.parseEther(value);
    var sendPromise = fromWallet.send(toAddress, amount);
    sendPromise.then(transactionHash => {
      var txHash = transactionHash.hash;
      var balance = this.getBalance(fromWallet);
      return txHash, balance;
    }).catch(arg => {
      alert("交易失败！原因是" + arg);
      console.log("交易失败！原因是" + arg);
    });
  },

  //storage

  storeData(dataName, data) {
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

