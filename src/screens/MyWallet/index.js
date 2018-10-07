import React, { Component } from "react";
import { Linking, Modal, View } from "react-native";
import { AsyncStorage } from "react-native";
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
  Text, Input, Item, H3, Footer, Toast, FooterTab, ListItem, List, DatePicker
} from "native-base";
import styles from "./styles";
import store from "../../store";
import axios from "axios";


import RNFileSelector from "react-native-file-selector";
import RNFS from "react-native-fs";

import abi from "../../contract/abi";


var CryptoJS = require("crypto-js");
var ethers = require("ethers");

var walletUtil = require("../../util/wallet");
var storageUtil = require("../../util/storage");

let contractAddress = "0x4D3F0D9a79ee462c29608De5A7f2692613502d70";

export default class MyWallet extends Component {
  // 从NewWallet或MyWallet传进参数：wallet，pin
  // 到Backup传出参数：wallet，pin
  constructor(props) {
    super(props);

    this.state = store.getState();
    console.log(this.state.walletData);
    this.state = {
      walletData: this.props.navigation.state.params.walletData,
      address: this.props.navigation.state.params.walletData.address,
      privateKeyRaw: this.props.navigation.state.params.walletData.privateKeyRaw,
      mnemonicRaw: this.props.navigation.state.params.walletData.mnemonicRaw,
      balance: this.props.navigation.state.params.walletData.balance,
      to: "0x486c14c72bd37ead125c37d9d624118946d18a36",
      value: "0.0001",
      ModalVisible: false,
      pin: "",
      task: "",
      active: 2,
      hasAccount: this.props.navigation.state.params.hasAccount,
      newHasSuccess: false,
      ListData: [
        {
          id: 1,
          address: "",
          user: "",
          docname: "",
          time: "",
          transaction: ""
        }
      ],
      TxHash: "",
      name: "",
      username: "",
      phone: "",
      email: "",
      idNum: "",

      patenter: "",
      patentName: "",
      patentTime: new Date(),
      patentDesc: "",

      hash: "",
      transaction: "",

      gotoTx: false
    };

  }


  componentDidMount() {

    console.log("reqApiHasAccount start");
    this.reqApiHasAccount();

    this.setState(store.getState());
    console.log("this.state:", store.getState());
    console.log("this.state:", this.state);
    if (!store.getState().login)
      this.setState({
        ModalVisible: true
      });

    axios.post("https://faucet.metamask.io/", this.state.address)
      .then(hash => console.log("hash", hash))
      .catch(e => console.log(e));

  }

  setModalVisible(nimade) {
    this.setState({ ModalVisible: nimade });
  }

  clearForm() {
    this.setState({
      patenter: "",
      patentName: "",
      patentTime: "",
      patentDesc: "",

      hash: "0x06d6618af81d32d10d4197b88266970e6d3bcf71b7c5ff594e575591a434f8cc",
      transaction: ""
    });
  }

  componentWillUnmount() {
    var walletData = {
      address: this.state.address,
      privateKeyRaw: this.state.privateKeyRaw,
      mnemonicRaw: this.state.mnemonicRaw,
      balance: this.state.balance
    };
    this.setState({ walletData: walletData });
    var action = {
      type: "set_walletData",
      walletData: walletData
    };
    store.dispatch(action);
    console.log(walletData);

    storageUtil.setData(walletData);

    clearInterval(this.timerID);
  }

  reqApiListData() {
    let api = "http://39.106.169.68:8080/api/v1/dev/mydoclist/" + this.state.address;
    axios.get(api).then((res) => {
      console.log(res);
      if (res.status == 200) {

        console.log(res.data);
        this.setState({ ListData: res.data });
        console.log("list", this.state.ListData);
      }
      // const result = res.data.data;
    }).catch(err => {
      console.log(err);
    });
  }

  postApiAccount() {
    let api = "http://39.106.169.68:8080/api/v1/dev/adduser";
    axios.post(api, {
        "address": this.state.address,
        "name": this.state.name,
        "username": this.state.username,
        "phone": this.state.phone,
        "mail": this.state.email,
        "identify": this.state.idNum
      }
    ).then((res) => {
      console.log(res);
      if (res.status == 200) {
        if (res.data.res) {
          this.setState({ hasAccount: true });
        }
      }
      // const result = res.data.data;
    }).catch(err => {
      console.log(err);
    });
  }

  reqApiHasAccount() {
    let api = "http://39.106.169.68:8080/api/v1/dev/ishave/" + this.state.address;
    axios.get(api).then((res) => {
      console.log("reqApiHasAccount", res);
      if (res.data.res) {
        this.setState({
          active: 2,
          hasAccount: true,
          address: res.data.data.address,
          idNum: res.data.data.identify,
          email: res.data.data.mail,
          phone: res.data.data.phone,
          username: res.data.data.username,
          name: res.data.data.name
        });
        // console.log(this.state.ListData);
      }
      const result = res.data.data;
    }).catch(err => {
      console.log(err);
    });
  }

  sendTx(wallet) {
    console.log("sendtx start");
    wallet.provider = ethers.providers.getDefaultProvider("ropsten");

    var contract = new ethers.Contract(contractAddress, abi, wallet);
    console.log("param,", this.state.address, this.state.patenter, this.state.patentName, this.state.patentTime.toString().substr(4, 12), this.state.patentDesc, this.state.hash);
    Toast.show({
      text: "正在写入区块链",
      buttonText: "Okay"
    });
    contract.newBanquan(this.state.address, this.state.patenter, this.state.patentName, this.state.patentTime.toString().substr(4, 12), this.state.patentDesc, this.state.hash).then((tx) => {
      console.log("tx:", tx);
      this.setState({ transaction: tx.hash });
      this.postApiPatent();
    }).catch(err => {
      console.log(err);
      Toast.show({
        text: "写入区块链失败",
        buttonText: "Okay"
      });
    });
  }

  postApiPatent() {
    let api = "http://39.106.169.68:8080/api/v1/dev/uploaddoc";
    Toast.show({
      text: "正在上传服务器",
      buttonText: "Okay"
    });
    axios.post(api, {
        "address": this.state.address,
        "user": this.state.patenter,
        "docname": this.state.patentName,
        "time": this.state.patentTime.toString().substr(4, 12),
        "info": this.state.patentDesc,
        "hash": this.state.hash,
        "transaction": this.state.transaction
      }
    ).then((res) => {
      console.log("postApiPatent", res);
      if (res.status == 200) {
        if (res.data.res) {
          Toast.show({
            text: "写入成功",
            buttonText: "Okay"
          });
          this.setState({
            newHasSuccess: true,
            gotoTx: false
          });
        }
      }
      // const result = res.data.data;
    }).catch(err => {
      console.log(err);
      Toast.show({
        text: "上传服务器失败",
        buttonText: "Okay"
      });
    });
  }


  refreshBalance(wallet) {

    wallet.provider = ethers.providers.getDefaultProvider("ropsten");
    var balancePromise = wallet.getBalance();
    balancePromise.then((balanceRaw) => {
      // console.log("balace", balanceRaw);
      var balance = parseInt(balanceRaw) / 1e18;
      this.setState({ balance: balance });
      var walletData = {
        address: this.state.address,
        privateKeyRaw: this.state.privateKeyRaw,
        mnemonicRaw: this.state.mnemonicRaw,
        balance: this.state.balance
      };
      this.setState({ walletData: walletData });
      var action = {
        type: "set_walletData",
        walletData: walletData
      };
      store.dispatch(action);
      // console.log("MyWalletPage:", walletData);
    });
  }

  open = (TxHash) => {
    let url = "https://ropsten.etherscan.io/tx/" + TxHash;
    Linking.openURL(url);
  };

  renderItem(rawData, idx) {
    return (
      <View key={idx}>
        <ListItem>
          <Left>
            <Text style={styles.listText}>{rawData.user} -- {rawData.docname}</Text>
          </Left>
        </ListItem>
        <ListItem onPress={() => {
          this.open(rawData.transaction);
        }}>
          <Left>
            <Text style={styles.listText}>{rawData.transaction.substring(0, 7)}</Text>

          </Left>
          <Body>
          <Text style={styles.listText}>{rawData.updated_at}</Text>
          </Body>
        </ListItem>
      </View>
    );
  }

  renderScreen() {
    if (this.state.active == 2) {
      // 我的账户
      if (this.state.hasAccount) {
        return (
          <Content>
            <H3 style={{ color: "#000", alignSelf: "center", marginTop: 10 }}>登录成功</H3>
            <Text style={{ padding: 10, fontSize: 15, alignSelf: "center", marginTop: 10 }}>
              个人信息
            </Text>
            <Text bordered style={{ marginTop: 20 }}>姓名：{this.state.name}</Text>
            <Text bordered style={{ marginTop: 20 }}>用户名：{this.state.username}</Text>
            <Text bordered style={{ marginTop: 20 }}>手机：{this.state.phone}</Text>
            <Text bordered style={{ marginTop: 20 }}>身份证号：{this.state.idNum}</Text>
            <Button full danger style={{ marginTop: 22 }} onPress={() => {
              AsyncStorage.clear().then(() => this.props.navigation.navigate("MainPage"));
              clearInterval(this.timerID);
            }}><Text>退出登录</Text></Button>
          </Content>

        );
      } else {
        return (
          <Content>
            <H3 style={{ color: "#000", alignSelf: "center", marginTop: 10 }}>登录成功</H3>
            <Text style={{ padding: 10, fontSize: 15, alignSelf: "center", marginTop: 10 }}>
              请修改个人信息
            </Text>
            <Input bordered placeholder="姓名：" style={{ marginTop: 20 }}
                   value={this.state.name} onChangeText={val => this.setState({ name: val })}/>
            <Input bordered placeholder="用户名：" style={{ marginTop: 20 }}
                   value={this.state.username} onChangeText={val => this.setState({ username: val })}/>
            <Input bordered placeholder="邮箱：" style={{ marginTop: 20 }}
                   value={this.state.email} onChangeText={val => this.setState({ email: val })}/>
            <Input bordered placeholder="手机：" style={{ marginTop: 20 }}
                   value={this.state.phone} onChangeText={val => this.setState({ phone: val })}/>
            <Input bordered placeholder="身份证号:" style={{ marginTop: 20 }}
                   value={this.state.idNum} onChangeText={val => this.setState({ idNum: val })}/>
            <Button full dark onPress={_ => this.postApiAccount()}>
              <Text>确定修改</Text>
            </Button>

            <Button full danger style={{ marginTop: 22 }} onPress={() => {
              AsyncStorage.clear().then(() => this.props.navigation.navigate("MainPage"));
              clearInterval(this.timerID);
            }}><Text>退出登录</Text></Button>
          </Content>
        );
      }

    } else if (this.state.active == 1) {
      // 列表
      return (
        <Content>
          <H3 style={{ color: "#000", textAlign: "center", marginTop: 10 }}>您已经申请的版权存证</H3>
          <List>
            <ListItem itemHeader first style={{ marginTop: 20 }}>
              <Left>
                <Text>TxHash</Text>
              </Left>
              <Body>
              <Text>TimeStamp</Text>
              </Body>
            </ListItem>
            {this.state.ListData.map((rawData, idx) => this.renderItem(rawData, idx))}
          </List>
        </Content>
      );
    } else if (this.state.active == 0) {
      // 新 newHasSuccess
      if (this.state.newHasSuccess) {
        return (
          <Content>
            <H3 style={{ color: "#000", alignSelf: "center", marginTop: 10 }}>恭喜您，您的版权存证已经申请成功！</H3>
            <Text bordered style={{ marginTop: 20 }} onPress={() => {
              this.open(this.state.transaction);
            }}>交易hash：{this.state.transaction}</Text>
            <Button full dark style={{ marginTop: 22 }} onPress={_ => {
              this.setState({ newHasSuccess: false });
              this.clearForm();
            }}>
              <Text>继续申请</Text></Button>
          </Content>

        );
      } else {
        return (
          <Content>
            {/*<RNFileSelector title={"Select File"} visible={true} onDone={() => {*/}
            {/*console.log("file selected: " + path);*/}
            {/*}} onCancel={() => {*/}
            {/*console.log("cancelled");*/}
            {/*}}/>*/}
            <H3 style={{ color: "#000", alignSelf: "center", marginTop: 10 }}>申请版权存证</H3>
            <Input bordered placeholder="声明人：" style={{ marginTop: 20 }}
                   value={this.state.patenter} onChangeText={val => this.setState({ patenter: val })}/>
            <Input bordered placeholder="版权名称：" style={{ marginTop: 20, marginBottom: 20 }}
                   value={this.state.patentName} onChangeText={val => this.setState({ patentName: val })}/>
            <DatePicker
              modalTransparent={false}
              animationType={"fade"}
              androidMode={"default"}
              placeHolderText="声明时间："
              textStyle={{ color: "green" }}
              placeHolderTextStyle={{ color: "#d3d3d3" }}
              onDateChange={val => this.setState({ patentTime: val })}
            />
            <Input bordered placeholder="简介：" style={{ marginTop: 20 }}
                   value={this.state.patentDesc} onChangeText={val => this.setState({ patentDesc: val })}/>
            <Button full dark style={{ marginTop: 20 }} onPress={_ => {
              RNFileSelector.Show(
                {
                  title: "Select File",
                  onDone: (path) => {
                    Toast.show({
                      text: "正在读取文件hash",
                      buttonText: "Okay"
                    });

                    RNFS.read(path)
                      .then((result) => {
                        Toast.show({
                          text: "读取文件hash完毕",
                          buttonText: "Okay"
                        });
                        console.log(result);
                        var hash = CryptoJS.MD5(CryptoJS.enc.Latin1.parse(result));
                        var md5 = hash.toString(CryptoJS.enc.Hex);
                        this.setState({ hash: md5 });
                        console.log("hash", md5);
                      })
                      .catch((err) => {
                        console.log(err.message);
                      });
                  },
                  onCancel: () => {
                    console.log("cancelled");
                  }
                }
              );
            }}>
              <Text>选择存证</Text>
            </Button>
            <Button full dark style={{ marginTop: 20 }} onPress={_ => {
              this.setModalVisible(true);
              this.setState({
                gotoTx: true,
                pin: ""
              });
            }}>
              <Text>写入区块链</Text>
            </Button>
          </Content>
        );
      }

    } else {
      return (
        <Content padder>
          <H3 style={{ color: "#000", alignSelf: "center" }}>转账</H3>
          <Item>
            <Input bordered placeholder="请输入对方地址" value={this.state.to} onChangeText={(to) => this.setState({ to })}/>
            <Input bordered placeholder="请输入转账金额ETH" value={this.state.value.toString()}
                   onChangeText={(value) => this.setState({ value })}/>
          </Item>
          <Button full dark style={{ marginTop: 20 }} onPress={() => {
            this.setState({ ModalVisible: true, pin: "", task: "tx" });
          }}>
            <Text>转账</Text>
          </Button>
          <Text style={{ padding: 10, fontSize: 11 }}>
            我的钱包地址:{this.state.address}
          </Text>
          <Text style={{ padding: 10, fontSize: 22, alignSelf: "center" }}>
            {this.state.balance.toFixed(18)}
          </Text>
          <Text style={{ padding: 10, fontSize: 11 }}>
            当前交易哈希: {this.state.txHash}
          </Text>
          <Button full dark style={{ marginTop: 20 }} onPress={() => {
            this.setState({ ModalVisible: true, pin: "", task: "backup" });
          }}><Text>备份钱包</Text></Button>
        </Content>
      );
    }

  }


  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            {/*<Button transparent onPress={() => this.props.navigation.goBack()}>*/}
            {/*<Icon name="arrow-back"/>*/}
            {/*</Button>*/}
          </Left>
          <Body>
          <Title>我的钱包</Title>
          </Body>
          <Right>
          </Right>
        </Header>


        {this.renderScreen()}


        <Footer>
          <FooterTab>
            <Button vertical onPress={_ => this.setState({ active: 0 })}>
              <Icon active={this.state.active == 0} name="apps"/>
              <Text>新的申请</Text>
            </Button>
            <Button vertical onPress={_ => {
              this.setState({ active: 1 });
              this.reqApiListData();
            }
            }>
              <Icon active={this.state.active == 1} name="camera"/>
              <Text>存证列表</Text>
            </Button>
            <Button vertical onPress={_ => this.setState({ active: 2 })}>
              <Icon active={this.state.active == 2} name="person"/>
              <Text>个人信息</Text>
            </Button>
          </FooterTab>
        </Footer>

        <View>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.ModalVisible}
            onRequestClose={() => {
              alert("Modal has been closed.");
            }}>
            <View style={{ marginTop: 22 }}>

              <H3 style={{ color: "#000", alignSelf: "center" }}>{this.state.gotoTx ? "请验证PIN码来写入区块链" : "欢迎回来，请登录"}</H3>
              <Text style={{ color: "#000", alignSelf: "center" }}></Text>
              <Item>
                <Input bordered placeholder="输入PIN码" value={this.state.pin}
                       onChangeText={pin => this.setState({ pin: pin })}/>
              </Item>
              <Button full dark style={{ marginTop: 20 }} onPress={() => {
                var wallet = walletUtil.checkPin(this.state.walletData, this.state.pin);
                console.log(wallet);
                if (wallet) {
                  var toastText = "验证成功";
                  if (this.state.gotoTx) {
                    this.sendTx(wallet);
                  }
                } else {
                  var toastText = "验证失败";

                }
                this.setModalVisible(false);
                Toast.show({
                  text: toastText,
                  buttonText: "Okay"
                });

                console.log("下一步", this.state.ModalVisible);
                // alert("PIN码错误！")
              }}>
                <Text>{this.state.gotoTx ? "验证" : "登录"}</Text>
              </Button>
              {this.renderClose()}

            </View>
          </Modal>
        </View>


      </Container>
    );
  }

  renderClose() {
    if (this.state.gotoTx) {
      return (
        <Button full dark style={{ marginTop: 20 }} onPress={() => this.setModalVisible(false)}>
          <Text>关闭</Text>
        </Button>
      );
    }
    return;

  }
}


