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
  Text, Input, Item, H3, Footer, Toast, FooterTab, ListItem, List
} from "native-base";
import styles from "./styles";
import store from "../../store";
import axios from "axios";

var CryptoJS = require("crypto-js");
var ethers = require("ethers");

var walletUtil = require("../../util/wallet");
var storageUtil = require("../../util/storage");

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
      active: 0,
      hasAccount: false,
      newHasSuccess: false,
      ListData:[
        {
          TxHash:'***************',
          TimeStamp:'***************'
        },
        {
          TxHash:'***************',
          TimeStamp:'***************'
        },
        {
          TxHash:'***************',
          TimeStamp:'***************'
        },
        {
          TxHash:'***************',
          TimeStamp:'***************'
        },

      ],
      TxHash: ''

    };

  }

  componentDidMount() {
    this.setState(store.getState());
    console.log("this.state:", store.getState());
    console.log("this.state:", this.state);
    if (!store.getState().login)
      this.setState({
        ModalVisible: true
      });
  }

  setModalVisible(nimade) {
    this.setState({ ModalVisible: nimade });
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
    let api = ''
    axios.get(api).then((res) => {
      console.log(res);
      if (res.status == 200) {
        this.setState({ListData:res.data});
        console.log(this.state.ListData);
      }
      // const result = res.data.data;
    }).catch(err => {
      console.log(err);
    });

  }



  refreshBalance(wallet) {

    wallet.provider = ethers.providers.getDefaultProvider("ropsten");
    var balancePromise = wallet.getBalance();
    balancePromise.then((balanceRaw) => {
      console.log("balace", balanceRaw);
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
      console.log("MyWalletPage:", walletData);
    });
  }

  open=(TxHash)=>{
    let url = 'https://ropsten.etherscan.io/tx/'+TxHash;
    Linking.openURL(url)
  }

  renderItem(rawData, idx) {
    return (
      <ListItem key={idx} onPress={() => {
        this.open(rawData.TxHash);
      }}>
        <Left>
          <Text style={styles.listText}>{rawData.TxHash}</Text>

        </Left>
        <Body>
        <Text style={styles.listText}>{rawData.TimeStamp}</Text>
        </Body>
      </ListItem>
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
            <Text bordered style={{ marginTop: 20 }}>姓名：***</Text>
            <Text bordered style={{ marginTop: 20 }}>用户名：***</Text>
            <Text bordered style={{ marginTop: 20 }}>手机：***</Text>
            <Text bordered style={{ marginTop: 20 }}>身份证号：***</Text>
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
            <Input bordered placeholder="姓名：" style={{ marginTop: 20 }}/>
            <Input bordered placeholder="用户名：" style={{ marginTop: 20 }}/>
            <Input bordered placeholder="邮箱：" style={{ marginTop: 20 }}/>
            <Input bordered placeholder="手机：" style={{ marginTop: 20 }}/>
            <Input bordered placeholder="身份证号:" style={{ marginTop: 20 }}/>
            <Button full dark onPress={_ => this.setState({ hasAccount: true })}>
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
          <H3 style={{ color: "#000", alignSelf: "center", marginTop: 10 }}>您已经申请的版权存证</H3>
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
            <Text style={{ padding: 10, fontSize: 15, alignSelf: "center", marginTop: 10 }}>
              申请信息
            </Text>
            <Text bordered style={{ marginTop: 20 }}>声明人：***</Text>
            <Text bordered style={{ marginTop: 20 }}>版权名称：***</Text>
            <Text bordered style={{ marginTop: 20 }}  onPress={() => {
              this.open(this.state.TxHash);
            }}>交易hash：***</Text>
            <Button full dark style={{ marginTop: 22 }} onPress={_ => this.setState({ newHasSuccess: false })}>
             <Text>继续申请</Text></Button>
          </Content>

        );
      } else {
        return (
          <Content>
            <H3 style={{ color: "#000", alignSelf: "center", marginTop: 10 }}>申请版权存证</H3>
            <Input bordered placeholder="声明人：" style={{ marginTop: 20 }}/>
            <Input bordered placeholder="版权名称：" style={{ marginTop: 20 }}/>
            <Input bordered placeholder="声明时间：" style={{ marginTop: 20 }}/>
            <Input bordered placeholder="简介：" style={{ marginTop: 20 }}/>
            <Button full dark style={{ marginTop: 20 }}>
              <Text>点击上传</Text>
            </Button>
            <Button full dark style={{ marginTop: 20 }} onPress={_ => this.setState({ newHasSuccess: true })}>
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
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back"/>
            </Button>
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
            <Button vertical onPress={_ => this.setState({ active: 1 })}>
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

              <H3 style={{ color: "#000", alignSelf: "center" }}>欢迎回来，请登录</H3>
              <Text style={{ color: "#000", alignSelf: "center" }}></Text>
              <Item>
                <Input bordered placeholder="输入PIN码" value={this.state.pin}
                       onChangeText={pin => this.setState({ pin: pin })}/>
              </Item>
              <Button full dark style={{ marginTop: 20 }} onPress={() => {
                var wallet = walletUtil.checkPin(this.state.walletData, this.state.pin);
                console.log(wallet);
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

                  var toastText = "验证成功";


                  this.timerID = setInterval(
                    () => {
                      this.refreshBalance(wallet);
                    },
                    2000
                  );


                  if (this.state.task == "tx") {
                    // var txHash = walletUtil.sendTx(wallet,this.state.to,this.state.value)
                    var amount = ethers.utils.parseEther(this.state.value);
                    wallet.provider = ethers.providers.getDefaultProvider("ropsten");
                    var sendPromise = wallet.send(this.state.to, amount);
                    sendPromise.then(transactionHash => {
                      var txHash = transactionHash.hash;
                      this.setState({ txHash: txHash });
                      console.log("txHash", txHash);

                      if (txHash) {
                        Toast.show({
                          text: "交易成功",
                          buttonText: "Okay"
                        });
                        var oldBalance = this.state.balance;
                        console.log(oldBalance);
                        var balance = 0;
                        // while(1!=2) console.log(balance,txCount)
                        // while(oldBalance >= balance || oldTxCount >= txCount){
                        var balancePromise = wallet.getBalance();
                        balancePromise.then((balanceRaw) => {
                          balance = parseInt(balanceRaw) / 1e18;
                          this.setState({ balance: balance });

                        });
                      }

                    }).catch(arg => {
                      alert("交易失败！原因是" + arg);
                    });


                  } else if (this.state.task == "backup") {
                    this.props.navigation.navigate("PreBackup", { wallet: wallet, pin: this.state.pin });

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
                <Text>登录</Text>
              </Button>
            </View>
          </Modal>
        </View>


      </Container>
    );
  }
}


