import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

// antd 
import { Form, Input, Icon, Button, Col, message } from "antd";
const FormItem = Form.Item;



class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      confirmDirty: false,
      registerMessage: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleConfirmBlur = this.handleConfirmBlur.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
    this.checkConfirm = this.checkConfirm.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      registerMessage: false
    })
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let registrationDatas = new FormData();
        registrationDatas.append("mail", values.email);
        registrationDatas.append("password", values.password);
        registrationDatas.append("artistName", values.artistName);
        registrationDatas.append("website", values.website);

        fetch("/register", {
          method: "POST",
          body: registrationDatas
        })
          .then(response => response.json())
          .then(answerRegistration => {
            if (answerRegistration.artist) {
              this.props.sendLoggedArtist(answerRegistration.artist);
              this.setState({ registerMessage: false });
              message.success("your account has been saved");

            } else {
              this.setState({ registerMessage: answerRegistration.errRegister });
              this.props.form.resetFields(["password", "confirm", "artistName"]);
              message.error("something went wrong, registration failed!");
            }
          })
          .catch(error => {
            console.log("Request failed", error);
          });
      }
    });
  }

  handleConfirmBlur(e) {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  checkPassword(rule, value, callback) {
    const form = this.props.form;
    if (value && value !== form.getFieldValue("password")) {
      callback("Passwords doesn't match!");
    } else {
      callback();
    }
  }

  checkConfirm(rule, value, callback) {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24 }
      }
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 10,
          offset: 9
        
      }
    }
  };

    const RoundButton = styled(Button)`
      border-radius: 20px
      border: none;
      margin: 0 auto;
      padding: 10px 25px;
      line-height: 0;
      &:hover {
        color: #4f4db3
      }
    `;




    return (
      <div>
        <Form layout='vertical'
        onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout}>
            {getFieldDecorator("email", {
              rules: [
                {
                  type: "email",
                  message: "invalid Email!"
                },
                {
                  required: true,
                  message: "Please enter your Email!"
                }
              ]
            })(
              <Input
                prefix={
                  <Icon type="mail" style={{color: "rgba(0,0,0,.25)"}} />
                }
                placeholder="Email"
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout}>
            {getFieldDecorator("password", {
              rules: [
                {
                  required: true,
                  message: "Please enter your password!"
                },
                {
                  validator: this.checkConfirm
                }
              ]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{color: "rgba(0,0,0,.25)"}} />
                }
                type="password"
                placeholder="Password"
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout}>
            {getFieldDecorator("confirm", {
              rules: [
                {
                  required: true,
                  message: "Please confirm your password!"
                },
                {
                  validator: this.checkPassword
                }
              ]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{color: "rgba(0,0,0,.25)"}} />
                }
                type="password"
                placeholder="Confirm Password"
                onBlur={this.handleConfirmBlur}
              />
            )}
          </FormItem>

          <FormItem {...formItemLayout}>
            {getFieldDecorator("artistName", {
              rules: [
                {
                  required: true,
                  message: "Please enter your Artist Name!",
                  whitespace: true
                }
              ]
            })(
              <Input
                prefix={
                  <Icon type="user" style={{color: "rgba(0,0,0,.25)"}} />
                }
                type="name"
                placeholder="Your name as a Tatto Artist"
              />
            )}
          </FormItem>

          <FormItem {...formItemLayout}>
            {getFieldDecorator("website", {
              rules: [{ required: false, message: "Please input website!" }]
            })(
              <Input
                prefix={
                  <Icon type="global" style={{color: "rgba(0,0,0,.25)"}} />
                }
                type="website"
                placeholder="Website"
              />
            )}
          </FormItem>

          <FormItem {...tailFormItemLayout}>
            <RoundButton htmlType="submit">
              Register
            </RoundButton>
          </FormItem>
        </Form>
        {this.state.logMessage && (<Col span={18} align='middle'><p className="white">{this.state.logMessage}</p></Col>)}
      </div>
    );
  }
}

const RegisterForm = Form.create()(Register);

// send artistID to the reducer
const mapDispatchToProps = (dispatch, props) => {
  return {
    sendLoggedArtist: function(value) {
      dispatch({ type: "ARTIST_IS_LOG", artist: value });
    }
  };
};

const mapStateToProps = state => {
  // state.sendCityCoords reçu via sendCityCoords.reducer devient props.newCity
  return {
    artist: state.sendLoggedArtist
  };
};

const RegisterFormRedux = connect(mapStateToProps, mapDispatchToProps)(RegisterForm);

export default RegisterFormRedux;