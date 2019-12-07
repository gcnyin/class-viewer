import React, { Component } from "react";
import { Layout, Menu, Icon, Switch } from "antd";

import { ByteCodeContainer } from "./model/ByteCodeContainer";
import ByteStream from "./model/ByteStream";
import ClassFileParser from "./parser";

const { Header, Footer, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      byteArray: [],
      byteStream: null,
      selectedByteCode: [],
      theme: "dark"
    };
  }

  setSelectedByteCode = codeIndex => () => this.setState({ selectedByteCode: codeIndex });

  handleFileRead = event => {
    const result = event.target.result;
    const length = result.length;
    const byteArray = [];
    for (let i = 0; i < length; i++) {
      let byteStr = result.charCodeAt(i).toString(16);
      if (byteStr.length < 2) {
        byteStr = "0" + byteStr;
      }
      byteArray.push(byteStr.toUpperCase());
    }
    this.setState({ byteArray: byteArray, byteStream: new ByteStream(byteArray) });
  };

  handleFileChosen = file => {
    let fileReader = new FileReader();
    fileReader.onloadend = this.handleFileRead;
    fileReader.readAsBinaryString(file);
  };

  createCodeIndex = (start, step) => {
    return () => {
      let result = [];
      for (let i = start; i < start + step; i++) {
        result.push(i);
      }
      this.setState({ selectedByteCode: result });
    };
  };

  themeOnChange = () => this.setState({ theme: this.state.theme === "dark" ? "light" : "dark" });

  file = () => {
    if (this.state.byteStream) {
      if (!this.classFile) {
        this.classFile = new ClassFileParser(this.state.byteStream).classFile();
      }
      console.log(this.classFile);
      return (
        <Menu theme={this.state.theme} defaultSelectedKeys={["1"]} defaultOpenKeys={["sub1"]} mode="inline">
          <Menu.Item onClick={this.createCodeIndex(0, 4)}>{`magic_number: ${this.classFile.magic}`}</Menu.Item>
          <Menu.Item onClick={this.createCodeIndex(4, 2)}>{`minor_version: ${this.classFile.minorVersion}`}</Menu.Item>
          <Menu.Item onClick={this.createCodeIndex(6, 2)}>{`major_version: ${this.classFile.majorVersion}`}</Menu.Item>
          <Menu.Item onClick={this.createCodeIndex(8, 2)}>{`constant_pool_count: ${this.classFile.constantPoolCount}`}</Menu.Item>
          <SubMenu title="constant_pool">
            {this.classFile.constantPool.constantList.map(c => c.toMenu(this.setSelectedByteCode))}
          </SubMenu>
          <Menu.Item onClick={this.createCodeIndex(this.classFile.constantPoolEnd, 2)}>{`access_flags: ${
            this.classFile.accessFlags.value
          } -> ${this.classFile.accessFlags.accessFlags.join(", ")}`}</Menu.Item>
          <Menu.Item onClick={this.createCodeIndex(this.classFile.constantPoolEnd + 2, 2)}>{`this_class: ${this.classFile.thisClass.index} -> ${this.classFile.thisClass.text}`}</Menu.Item>
          <Menu.Item onClick={this.createCodeIndex(this.classFile.constantPoolEnd + 4, 2)}>{`super_class: ${this.classFile.superClass.index} -> ${
            this.classFile.superClass.text
          }`}</Menu.Item>
          <Menu.Item onClick={this.createCodeIndex(this.classFile.constantPoolEnd + 6, 2)}>{`interfaces_count: ${this.classFile.interfacesCount}`}</Menu.Item>
          {this.classFile.interfaces.length === 0 ? (
            <Menu.Item>interfaces</Menu.Item>
          ) : (
            <SubMenu key="interface-sub-menu" title="interfaces">
              {this.classFile.interfaces.map((i, index) => (
                <Menu.Item onClick={this.createCodeIndex(i.position, 2)} key={i.value + i.name}>{`#${index}: #${i.value} -> ${i.name}`}</Menu.Item>
              ))}
            </SubMenu>
          )}
          <Menu.Item onClick={this.createCodeIndex(this.classFile.interfacesEnd, 2)}>{`fields_count: ${this.classFile.fieldsCount}`}</Menu.Item>
        </Menu>
      );
    }
  };

  renderByteCodeContainer = () =>
    this.state.byteArray === null ? "" : <ByteCodeContainer byteArray={this.state.byteArray} />;

  byteCode() {
    return this.state.byteArray.length === 0 ? (
      <div />
    ) : (
      this.state.byteArray.map((b, index) => {
        let style = {};
        if (this.state.selectedByteCode.includes(index)) {
          style = {
            fontFamily: '"Courier New", Courier, monospace',
            padding: "4px",
            backgroundColor: "#dddddd",
            fontWeight: "bold"
          };
        } else {
          style = { fontFamily: '"Courier New", Courier, monospace', padding: "4px", fontWeight: "bold" };
        }
        return (
          <div style={style} key={b + " " + index}>
            {b}
          </div>
        );
      })
    );
  }

  render() {
    return (
      <Layout>
        <Sider
          width="500"
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0
          }}
        >
          <div className="logo" />
          {this.file()}
        </Sider>
        <Layout style={{ marginLeft: 500 }}>
          <Header style={{ background: "#fff", padding: 0 }}>
            <div style={{ marginLeft: 20 }}>
              {/* <Icon type="file-text" /> */}
              <input
                type="file"
                id="input-file"
                accept=".class"
                style={{ marginLeft: 5 }}
                onChange={e => this.handleFileChosen(e.target.files[0])}
              />
              <Switch
                defaultChecked={false}
                onChange={this.themeOnChange}
                checkedChildren="light"
                unCheckedChildren="dark"
              />
            </div>
          </Header>
          <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
            <div style={{ padding: 24, background: "#fff", display: "flex", flexWrap: "wrap" }}>{this.byteCode()}</div>
          </Content>
          <Footer style={{ textAlign: "center" }}>JVM class file online viewer | Created by Huang Hezhao</Footer>
        </Layout>
      </Layout>
    );
  }
}

export default App;
