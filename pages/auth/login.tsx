import { AuthLayout } from "@component/components/layouts";
import { validations } from "@component/utils";
import { ErrorOutline } from "@mui/icons-material";
import { Box, Button, Chip, Divider, Grid, Link, TextField, Typography } from "@mui/material";
import { GetServerSideProps } from 'next';
import { getSession, signIn, getProviders } from "next-auth/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type FormData = {
    email: string;
    password: string;
};

const LoginPage = () => {

    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false);
    const [providers, setProviders] = useState<any>({});

    useEffect(() => {
        getProviders().then(prov => {
            setProviders(prov);
        })
    }, [])


    const onLoginUser = async ({ email, password }: FormData) => {

        setShowError(false);

        // const isValidLogin = await loginUser(email, password);
        // if (!isValidLogin) {
        //     setShowError(true);
        //     setTimeout(() => {
        //         setShowError(false);
        //     }, 3000);
        //     return;
        // }
        // //consultamos si el usuario estuvo en un ruta antes de loguearse para así mantener la ultima pagina
        // const destination = router.query.page?.toString() || '/';
        // router.push(destination);
        await signIn('credentials', { email, password });
    }

    return (
        <AuthLayout title="Ingresar">
            <form onSubmit={handleSubmit(onLoginUser)} noValidate>
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h1" component="h1">Iniciar Sesión</Typography>
                            <Chip
                                label='No reconocemos el usuario o contraseña'
                                color="error"
                                icon={<ErrorOutline />}
                                className="fadeIn"
                                sx={{ display: showError ? 'flex' : 'none' }}
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
                                    required: 'Debe ingresar la contraseña',
                                    minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                                })
                                }
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button type="submit" color="secondary" className="circular-btn" size="large" fullWidth>
                                Ingresar
                            </Button>
                        </Grid>

                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <NextLink
                                // utilizamos esto para ir a la ultima pagina del usuario
                                href={router.query.page ? `/auth/register?page=${router.query.page}` : '/auth/register'}
                                passHref
                                legacyBehavior
                            >
                                <Link underline="always">
                                    ¿No tienes cuenta?
                                </Link>
                            </NextLink>
                        </Grid>

                        <Grid item xs={12} display='flex' flexDirection='column' justifyContent='end'>
                            <Divider sx={{ width: '100%', mb: 2 }} />

                            {
                                Object.values(providers).map((provider: any) => {

                                    if (provider.id === 'credentials') return (<div key="credentials" ></div>)

                                    return (
                                        <Button
                                            key={provider.id}
                                            variant="outlined"
                                            fullWidth
                                            color="secondary"
                                            sx={{ mb: 1 }}
                                            onClick={() => signIn(provider.id)}
                                        >
                                            {provider.name}
                                        </Button>
                                    )
                                })
                            }
                        </Grid>

                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
}

export default LoginPage;

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