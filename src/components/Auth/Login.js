import React, { useState } from 'react';
// import { toast, ToastContainer } from 'react-toastify';
import { auth } from '../Config';
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import YupPassword from 'yup-password';
import { useNavigate } from 'react-router-dom';
YupPassword(Yup);


const MyTextInput = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <>
            <div className='form-group'>
                <label className='form-label mt-2' htmlFor={props.id || props.name}>{label}</label>
                <input className="text-input form-control shadow-none" {...field} {...props} />
                {meta.touched && meta.error ? (
                    <div className="error">{meta.error}</div>
                ) : null}
            </div>
        </>
    );
};



export default function Login() {

    const navigate = useNavigate()
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('')

    const onSubmit = async (values) => {
        const { email, password } = values
        signInWithEmailAndPassword(auth, email, password)
            .then((cred) => {
                sessionStorage.setItem('token', cred.user.accessToken);
                setSuccess('Login Successful')
                // signIn({
                //     token: cred.user.accessToken,
                //     expiresIn: 3600,
                //     tokenType: "Bearer",
                //     authState: { email: values.email },
                // });
                navigate('/admin')
            }).catch((err) => {
                // console.log(err.message)
                setError(err.message)
            })
    }

    return (
        <>

            <div className='logRegWrapper'>
                <div className='logReg'>
                    {
                        error ? (<p className='text-center text-danger'>{error}</p>) :
                            (<p className='text-center text-success'>{success}</p>)
                    }

                    <Formik
                        initialValues={{
                            email: '', password: '',
                        }}
                        validationSchema={Yup.object({
                            email: Yup.string()
                                .email('Invalid email address')
                                .required('Required'),

                            password: Yup.string().min(8, 'password must up to 8 character')
                                .minLowercase(1, 'password must have one lowercase').minUppercase(1, 'password must have one uppercase')
                                .minNumbers(1, 'password must have one number').minSymbols(1, 'password must have one symbol').required("Required"),
                        })}
                        onSubmit={(values, { setSubmitting }) => {
                            onSubmit(values)
                            setTimeout(() => {
                                // alert(JSON.stringify(values, null, 2));
                                setSubmitting(false);
                            }, 400);
                        }}>
                        <Form>
                            <h4 className='text-center pt-2'>Welcome Back!</h4>
                            <div className='form-group m-1'>
                                <MyTextInput name="email" type="email" placeholder="DoeJane@gmail.com" />
                            </div>

                            <div className='form-group m-1'>
                                <MyTextInput name="password" type="password" placeholder="password" />
                            </div>

                            <div className='form-group m-1 mt-3'>
                                <button type="submit" className='btn btn-dark btn-sm w-100'>Submit</button>
                            </div>
                        </Form>
                    </Formik>
                </div>
            </div>
        </>
    )
}