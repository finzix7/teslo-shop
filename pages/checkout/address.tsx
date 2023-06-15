import { ShopLayout } from "@component/components/layouts";
import { CartContext } from "@component/context";
import { countries } from "@component/utils";
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useState, useContext, useEffect } from 'react';
import { useForm } from "react-hook-form";

type FormData = {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    zip: string;
    city: string;
    country: string;
    phone: string;
}

const getAddressFromCookies = (): FormData => {
    return {
        firstName: Cookies.get('firstName') || '',
        lastName: Cookies.get('lastName') || '',
        address: Cookies.get('address') || '',
        address2: Cookies.get('address2') || '',
        zip: Cookies.get('zip') || '',
        city: Cookies.get('city') || '',
        country: Cookies.get('country') || '',
        phone: Cookies.get('phone') || '',
    }
}

const AddressPage = () => {

    const { updateAddress } = useContext(CartContext);

    const router = useRouter();

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        defaultValues: getAddressFromCookies()
    });

    const onSubmitAddress = (data: FormData) => {
        updateAddress(data);
        router.push('/checkout/summary');
    };

    useEffect(() => {
        reset(getAddressFromCookies());
    }, [reset])


    return (
        <ShopLayout title="Dirección" pageDescription="Confirmar dirección de destinatario">
            <form onSubmit={handleSubmit(onSubmitAddress)} noValidate>
                <Typography variant="h1" component="h1">Dirección</Typography>

                <Grid container spacing={2} sx={{ mt: 2 }}>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Nombre'
                            variant="filled"
                            fullWidth
                            {
                            ...register('firstName', {
                                required: 'El nombre es obligatorio',
                                minLength: { value: 2, message: 'El nombre debe contener al menos 2 caracteres' }
                            })
                            }
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Apellido'
                            variant="filled"
                            fullWidth
                            {
                            ...register('lastName', {
                                required: 'El apellido es obligatorio',
                                minLength: { value: 2, message: 'El apellido debe contener al menos 2 caracteres' }
                            })
                            }
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Dirección'
                            variant="filled"
                            fullWidth
                            {
                            ...register('address', {
                                required: 'Debe ingresar una dirección',
                                minLength: { value: 2, message: 'La dirección debe contener al menos 2 caracteres' }
                            })
                            }
                            error={!!errors.address}
                            helperText={errors.address?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Dirección 2 (opcional)'
                            variant="filled"
                            fullWidth
                            {
                            ...register('address2')
                            }
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Código Postal'
                            variant="filled"
                            fullWidth
                            {
                            ...register('zip', {
                                required: 'Debe ingresar un código postal',
                                minLength: { value: 2, message: 'El código postal debe contener al menos 2 caracteres' }
                            })
                            }
                            error={!!errors.zip}
                            helperText={errors.zip?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Ciudad'
                            variant="filled"
                            fullWidth
                            {
                            ...register('city', {
                                required: 'Debe ingresar una cuidad',
                                minLength: { value: 2, message: 'La cuidad debe contener al menos 2 caracteres' }
                            })
                            }
                            error={!!errors.city}
                            helperText={errors.city?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <TextField
                                select
                                variant="filled"
                                label="País"
                                defaultValue={Cookies.get('country') || countries[0].code}
                                {...register('country', {
                                    required: 'Este campo es requerido'
                                })}
                                error={!!errors.country}
                            >
                                {
                                    countries.map(country => (
                                        <MenuItem
                                            key={country.code}
                                            value={country.code}
                                        >{country.name}</MenuItem>
                                    ))
                                }
                            </TextField>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Teléfono'
                            variant="filled"
                            fullWidth
                            {
                            ...register('phone', {
                                required: 'Debe ingresar un telefono',
                                minLength: { value: 8, message: 'La cuidad debe contener al menos 2 caracteres' }
                            })
                            }
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                        />
                    </Grid>

                </Grid>

                <Box sx={{ mt: 5 }} display='flex' justifyContent='center' >
                    <Button
                        type="submit"
                        color="secondary"
                        className="circular-btn"
                        size="large"
                    >
                        Revisar pedido
                    </Button>
                </Box>
            </form>
        </ShopLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
// export const getServerSideProps: GetServerSideProps = async ({ req }) => {

//     const { token = '' } = req.cookies;
//     let isValidToken = false;

//     try {
//         await jwt.isValidToken(token);
//         isValidToken = true;
//     } catch (error) {
//         isValidToken = false;
//     }

//     if (!isValidToken) {
//         return {
//             redirect: {
//                 destination: '/auth/login?page=/checkout/address',
//                 permanent: false,
//             }
//         }
//     }

//     return {
//         props: {

//         }
//     }
// }


export default AddressPage