
var ethers = require("ethers");

import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Left,
  Right,
  Body,
  Text, Input, Item, H3
} from "native-base";
import styles from "./styles";

import { AsyncStorage } from "react-native";

var CryptoJS = require("crypto-js");
var walletUtil = require("../../util/wallet");
var storageUtil = require("../../util/storage");
import store from "../../store";

export default class PinPage extends Component {
  // 从ImportWallet传进参数：wallet
  // 到MyWallet传出参数：walletData
  constructor(props) {
    super(props);
    this.state = {
      wallet: this.props.navigation.state.params.wallet,
      pin: "",
      loading: ''

    };
  }

  _sendData() {
    var pin = this.state.pin;
    var wallet = this.state.wallet;
    console.log(wallet);
    wallet.provider = ethers.providers.getDefaultProvider("ropsten");
    var balancePromise = wallet.getBalance();
    balancePromise.then((balance) => {
      balance = parseInt(balance) / 1e18;
      this.setState({ balance: balance });
      // console.log("balance:", balance);

      var walletData = walletUtil.saveWalletData(this.state);
      this.setState({ walletData: walletData });
      console.log(walletData);
      storageUtil.setData(walletData);
      this.props.navigation.navigate("MyWallet", { walletData: this.state.walletData });
    }).catch(arg => console.log("获取余额失败！原因是" + arg));


    if (wallet) {

      const action = {
        type: "set_wallet",
        wallet: wallet
      };
      store.dispatch(action);
      const action2 = {
        type: "login"
      };
      store.dispatch(action2);

      // this.timerID = setInterval(
      //   () => {
      //     this.refreshBalance(wallet);
      //   },
      //   2000
      // );
    }
  }
  refreshBalance(wallet){

    wallet.provider = ethers.providers.getDefaultProvider("ropsten");
    var balancePromise = wallet.getBalance();
    balancePromise.then((balanceRaw) => {
      // console.log("balace",balanceRaw)
      var balance = parseInt(balanceRaw) / 1e18;
      this.setState({ balance: balance });
      var walletData = this.state.walletData;
       walletData = {
        ...walletData,
        balance: this.state.balance
      };
      this.setState({ walletData: walletData, hasAccount: true });
      var action = {
        type:"set_walletData",
        walletData:walletData
      }
      store.dispatch(action);
    });
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back"/>
            </Button>
          </Left>
          <Body>
          <Title>进入钱包</Title>
          </Body>
          <Right>
          </Right>
        </Header>

        <Content padder>

          <H3 style={{ color: "#000", alignSelf: "center" }}>输入PIN码</H3>
          <Text style={{ color: "#000", alignSelf: "center" }}>PIN码用于交易签名。我们不存储PIN码，无法提供找回功能，请牢记</Text>
          <Item>
            <Input bordered placeholder="输入PIN码" value={this.state.pin}
                   onChangeText={(pin) => this.setState({ pin: pin })}/>
          </Item>
          <Button full dark style={{ marginTop: 20 }} onPress={() => this._sendData()}>
            <Text>下一步</Text>
          </Button>

          <H3 style={{ color: "#000", alignSelf: "center", marginTop: 20 }}>{this.state.loading}</H3>
        </Content>
      </Container>
    );
  }
}
