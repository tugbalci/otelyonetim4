import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, Form, Input } from 'antd';
import './Login.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const Login = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  
  const [form] = Form.useForm();

  const onFinish = useCallback(
    (values) => {
      const { username, password, remember } = values;

      signInWithEmailAndPassword(auth, username, password)
        .then(() => {
          navigate('/home');
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;

          if (errorCode === 'auth/wrong-password') {
            setError('Hatalı şifre, lütfen tekrar deneyin.');
          } else if (errorCode === 'auth/user-not-found') {
            setError('Kullanıcı bulunamadı, lütfen kayıt olun.');
          } else {
            setError(errorMessage);
          }
        });
    },
    [navigate]
  );

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="login-container">
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <h2>Giriş Yap</h2>
        {error && <p className="error-message">{error}</p>}
        <Form.Item
          label="E-posta"
          name="username"
          rules={[{ required: true, message: 'Lütfen e-posta adresinizi girin!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Şifre"
          name="password"
          rules={[{ required: true, message: 'Lütfen şifrenizi girin!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>Beni Hatırla</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Giriş Yap
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
