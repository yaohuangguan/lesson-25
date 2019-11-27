import React from 'react';

import FormInput from '../form-input/form-input.component';
import CustomButton from '../custom-button/custom-button.component';

import { auth, createUserProfileDocument } from '../../firebase/firebase.utils';

import './sign-up.styles.scss';

class SignUp extends React.Component {
  constructor() {
    super();

    this.state = {
      displayName: '',
      email: '',
      password: '',
      passwordConf: "",
      errors: [],
    };
  }

  handleSubmit = async event => {
    event.preventDefault();

    const { displayName, email, password, passwordConf } = this.state;
    if (password !== passwordConf) {
      this.setState(prevState => ({
        errors: ["密码不匹配，请确认", ...prevState.errors]
      }));
      return;
    }
    if (!displayName || !email || !password || !passwordConf) {
      this.setState({
        errors: "请输入完整的账号信息"
      });
      return;
    }
    try {
      const { user } = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      await createUserProfileDocument(user, { displayName });
      this.setState({
        displayName: "",
        email: "",
        password: "",
        passwordConf: "",
        errors: []
      });
    } catch (error) {
      console.log(error);
      if (error.code === "auth/weak-password") {
        this.setState({
          errors: "请输入至少6位以上密码"
        });
      }
      if (error.code === "auth/network-request-failed") {
        this.setState({
          errors: "网络错误，请检查你的网络连接"
        });
      }
      if (error.code === "auth/email-already-in-use") {
        this.setState({
          errors: "邮箱已经被注册了"
        });
      }
    }
  };

  handleChange = event => {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  };

  render() {
    const { errors,displayName, email, password, passwordConf } = this.state;
    return (
      <div className='sign-up'>
        <h2 className='title'>I do not have a account</h2>
        <span>Sign up with your email and password</span>
        <form className='sign-up-form' onSubmit={this.handleSubmit}>
        {errors ? (
                <div className="text-danger font-weight-bold">{errors}</div>
              ) : null}
          <FormInput
            type='text'
            name='displayName'
            value={displayName}
            onChange={this.handleChange}
            label='Display Name'
            required
          />
          <FormInput
            type='email'
            name='email'
            value={email}
            onChange={this.handleChange}
            label='Email'
            required
          />
          <FormInput
            type='password'
            name='password'
            value={password}
            onChange={this.handleChange}
            label='Password'
            required
          />
          <FormInput
            type='password'
            name='passwordConf'
            value={passwordConf}
            onChange={this.handleChange}
            label='Confirm Password'
            required
          />
          <CustomButton type='submit'>SIGN UP</CustomButton>
        </form>
      </div>
    );
  }
}

export default SignUp;
