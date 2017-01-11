import React, { Component } from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import TouchID from 'react-native-touch-id';
import { emailChanged, passwordChanged, loginUser } from '../actions';
import { Card, CardSection, Input, Button, Spinner } from './common';

class LoginForm extends Component {

  state = {
    showModal: false,
    showTouchID: null,
   };

  componentWillMount() {
    if (TouchID.isSupported()) {
      TouchID.isSupported()
      .then(() => this.setState({ showTouchID: true }))
      .catch(() => this.setState({ showTouchID: false }));
    }
  }

  componentDidMount() {
    console.log('View loaded');
  }

  onTouchIdButtonPress() {
    const email = 'test@test.com';
    const password = 'password';

    TouchID.authenticate('to authenticate the user')
      .then(() => {
        this.props.loginUser({ email, password });
      })
      .catch(error => {
        console.log(error);
      });
  }

  onEmailChange(text) {
    this.props.emailChanged(text);
  }

  onPasswordChange(text) {
    this.props.passwordChanged(text);
  }

  onButtonPress() {
    const { email, password } = this.props;

    this.props.loginUser({ email, password });
  }

  renderButton() {
    if (this.props.loading) {
      return <Spinner size="large" />;
    }

    return (
      <Button onPress={this.onButtonPress.bind(this)}>
        Login
      </Button>
    );
  }

  render() {
    return (
      <Card>
        <CardSection>
          <Input
            label="Email"
            placeholder="email@gmail.com"
            onChangeText={this.onEmailChange.bind(this)}
            value={this.props.email}
          />
        </CardSection>

        <CardSection>
          <Input
            value={this.props.password}
            secureTextEntry
            label="Password"
            placeholder="password"
            onChangeText={this.onPasswordChange.bind(this)}
          />
        </CardSection>

        <Text style={styles.errorTextStyle}>
          {this.props.error}
        </Text>

        <CardSection>
          {this.renderButton()}
        </CardSection>

        {this.state.showTouchID ?
          <CardSection>
            <Button onPress={this.onTouchIdButtonPress.bind(this)}>
              Login with TouchID
            </Button>
          </CardSection> : null
        }
      </Card>
    );
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red',
  }
};

const mapStateToProps = ({ auth }) => {
  const { email, password, error, loading } = auth;
  return { email, password, error, loading };
};

export default connect(mapStateToProps, {
  emailChanged, passwordChanged, loginUser
 })(LoginForm);
