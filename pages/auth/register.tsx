import { AuthLayout } from "@component/components/layouts";
import { AuthContext } from "@component/context";
import { validations } from "@component/utils";
import { ErrorOutline } from "@mui/icons-material";
import { Box, Button, Chip, Grid, Link, TextField, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import { getSession, signIn } from "next-auth/react";
import NextLink from 'next/link';
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";

type FormData = {
    name: string;
    email: string;
    password: string;
    password2: string;
};

const RegisterPage = () => {

    const router = useRouter();
    const { registerUser } = useContext(AuthContext);

    const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>();
    const [showError, setShowError] = useState(false);
    const [errorMessage, seterrorMessage] = useState('');

    const onRegisterUser = async ({ name, email, password }: FormData) => {

        setShowError(false);
        const { hasError, message } = await registerUser(name, email, password);

        if (hasError) {
            setShowError(true);
            seterrorMessage(message!)
            setTimeout(() => { setShowError(false); }, 3000);
            return;
        }

        //consultamos si el usuario estuvo en un ruta antes de loguearse para así mantener la ultima pagina
        // const destination = router.query.page?.toString() || '/';
        // router.replace(destination);

        await signIn('credentials', { email, password });
    }

    const validatePassword = (confirmPassword: string) => {
        const password = watch('password');

        if (confirmPassword !== password) {
            return 'Las contraseñas no coinciden';
        }

        return true;
    };

    return (
        <AuthLayout title="Ingresar">
            <form onSubmit={handleSubmit(onRegisterUser)} noValidate>
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h1" component="h1">Crear Cuenta</Typography>
                            <Chip
                                label='No fue posible registrar al usuario'
                                color="error"
                                icon={<ErrorOutline />}
                                className="fadeIn"
                                sx={{ display: showError ? 'flex' : 'none' }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Nombre"
                                variant="filled"
                                fullWidth
                                {
                                ...register('name', {
                                    required: 'El nombre es obligatorio',
                                    minLength: { value: 2, message: 'El nombre debe ser minimo de 2 caracteres' }
                                })
                                }
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="email"
                                label="Correo"
                                variant="filled"
                                fullWidth
                                {
                                ...register('email', {
                                    required: 'El correo es obligatorio',
                                    validate: validations.isEmail
                                })
                                }
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Contraseña"
                                type="password"
                                variant="filled"
                                fullWidth
                                {
                                ...register('password', {
                                    required: 'La contraseña es obligatoria',
                                    minLength: { value: 6, message: 'La contrase debe ser al menos de 6 caracteres' }
                                })
                                }
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Repetir Contraseña"
                                type="password"
                                variant="filled"
                                fullWidth
                                {
                                ...register('password2', {
                                    required: 'La contraseña es obligatoria',
                                    minLength: { value: 6, message: 'La contrase debe ser al menos de 6 caracteres' },
                                    validate: validatePassword
                                })
                                }
                                error={!!errors.password2}
                                helperText={errors.password2?.message}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button type="submit" color="secondary" className="circular-btn" size="large" fullWidth>
                                Registrar
                            </Button>
                        </Grid>

                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <NextLink
                                // utilizamos esto para ir a la ultima pagina del usuario
                                href={router.query.page ? `/auth/login?page=${router.query.page}` : '/auth/login'}
                                passHref
                                legacyBehavior
                            >
                                <Link underline="always">
                                    ¿Ya tienes cuenta?
                                </Link>
                            </NextLink>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
}

export default RegisterPage;

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const session = await getSession({ req });
    const { p = '/' } = query;

    if (session) {
        return {
            redirect: {
                destination: p.toString(),
                permanent: false,
            }
        }
    }

    return {
        props: {

        }
    }
}