import React, { Component } from "react";
import { View } from "react-native";
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
  Text,
  Textarea
} from "native-base";

import { AsyncStorage } from "react-native";

import styles from "./styles";
import store from "../../store";

var ethers = require("ethers");
var CryptoJS = require("crypto-js");
var walletUtil = require("../../util/wallet");
var storageUtil = require("../../util/storage");

Array.prototype.remove = function(val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};

export default class Backup extends Component {
  // 从preBackup接受参数：wallet，pin
  // 让用户验证助记词
  // 加密钱包信息到walletData
  // 到MyWallet传出参数：walletData，pin
  constructor(props) {
    super(props);
    this.state = {
      wallet: this.props.navigation.state.params.wallet,
      mnemonic: this.props.navigation.state.params.wallet.mnemonic,
      pin: this.props.navigation.state.params.pin,
      textareaArray: [],
      textarea: "",
      stateWord: [],
      wordState: []
    };

  }

  componentDidMount() {
    this._displayWord();
    this._setWalletData();

  }

  _displayWord() {
    console.log(this.state);
    var mnemonic = this.state.mnemonic;
    var pin = this.state.pin;
    // var words = mnemonic.split(' ').sort(()=> .5 - Math.random());
    var words = mnemonic.split(" ");
    var wordState = new Array();
    words.map((item, i) => wordState[item] = true);
    this.setState({ stateWord: words, wordState: wordState }, () => {
      console.log(this.state);
    });
  }

  _setWalletData() {
    var wallet = this.state.wallet;
    wallet.provider = ethers.providers.getDefaultProvider("ropsten");
    var balancePromise = wallet.getBalance();
    balancePromise.then((balance) => {
      balance = parseInt(balance) / 1e18;
      this.setState({ balance: balance });
      console.log("balance:", balance);
      var walletData = walletUtil.saveWalletData(this.state);
      this.setState({ walletData });
      storageUtil.setData(walletData);

    }).catch(arg => alert("获取余额失败！原因是" + arg));
  }


  _addWord(item) {
    var wordState = this.state.wordState;
    var textarea = this.state.textarea;
    var textareaArray = this.state.textareaArray;
    textareaArray.push(item);
    console.log(textareaArray);
    textarea == "" ? textarea = item : textarea = textarea + " " + item;
    textarea = textareaArray.join(" ");
    wordState[item] = !wordState[item];
    this.setState({
      wordState: wordState,
      textarea: textarea,
      textareaArray: textareaArray
    });
  }

  _rmWord(item) {
    var wordState = this.state.wordState;
    var textarea = this.state.textarea;
    var textareaArray = this.state.textareaArray;
    textareaArray.remove(item);
    console.log(textareaArray);
    textarea = textareaArray.join(" ");
    wordState[item] = !wordState[item];
    this.setState({
      wordState: wordState,
      textarea: textarea,
      textareaArray: textareaArray
    });
  }

  _checkMnemonic() {
    console.log("textarea:" + this.state.textarea);
    console.log("mnemonic:" + this.state.mnemonic);
    if (this.state.textarea == this.state.mnemonic) {
      const action2 = {
        type: "login"
      };
      store.dispatch(action2);
      console.log("this.state backup",store.getState())
      this.props.navigation.navigate("MyWallet", { walletData: this.state.walletData });
    }
    else {
      alert("输入错误哦！");
    }
  }

  renderItem(item, i) {
    return (
      <Button dark={this.state.wordState[item]} light={!this.state.wordState[item]} style={styles.button}
              onPress={() => {
                this.state.wordState[item] ? this._addWord(item) : this._rmWord(item);
              }} key={i}><Text>{item}</Text></Button>
    );

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
          <Title>点击输入助记词</Title>
          </Body>
          <Right>
          </Right>
        </Header>

        <Content padder>
            <Textarea rowSpan={5} bordered placeholder="输入助记词，按空格分隔；或者直接点击助记词按钮输入"
                      value={this.state.textarea}
                      onChangeText={(textarea) => this.setState({ textarea })}/>
          <Content padder>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap" }}
            >
              {this.state.stateWord.map((item, i) => this.renderItem(item, i))}
            </View>
          </Content>
          <Button full dark style={{ marginTop: 20 }} onPress={() => this._checkMnemonic()}>
            <Text>确定</Text>
          </Button>

        </Content>
      </Container>
    );
  }
}

