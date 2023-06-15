import { CartList, OrderSummary } from "@component/components/cart";
import { AdminLayout, ShopLayout } from "@component/components/layouts";
import { dbOrders } from "@component/database";
import { IOrder } from "@component/interfaces";

import { AirplaneTicketOutlined, CreditCardOffOutlined, CreditScoreOutlined } from "@mui/icons-material";
import { Box, Card, CardContent, Chip, Divider, Grid, Typography } from "@mui/material";
import { GetServerSideProps, NextPage } from 'next';

interface Props {
    order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {

    const { shippingAddress, numberOfItems, subTotal, tax, total, } = order;

    return (
        <AdminLayout title="Resumen de la orden" subTitle={`Orden: ${order._id}`} icon={<AirplaneTicketOutlined />}>

            {
                order.isPaid
                    ? (
                        <Chip
                            sx={{ my: 2 }}
                            label="Orden Pagada Exitosamente"
                            variant="outlined"
                            color="success"
                            icon={<CreditScoreOutlined />}
                        />
                    ) :
                    (
                        <Chip
                            sx={{ my: 2 }}
                            label="Pediente de pago"
                            variant="outlined"
                            color="error"
                            icon={<CreditCardOffOutlined />}
                        />
                    )
            }

            <Grid container className="fadeIn">
                <Grid item xs={12} sm={7}>
                    <CartList products={order.orderItems} />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className="summary-card">
                        <CardContent>
                            <Typography variant="h2" >Resumen ({order.numberOfItems} {order.numberOfItems > 1 ? 'productos' : 'producto'})</Typography>

                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant="subtitle1" >Dirección de entrega</Typography>
                            </Box>


                            <Typography >{shippingAddress.firstName} {shippingAddress.lastName}</Typography>
                            <Typography >{shippingAddress.address} {shippingAddress.address2 ? `${shippingAddress.address2}` : ''}</Typography>
                            <Typography >{shippingAddress.city} {shippingAddress.zip}</Typography>
                            <Typography >{shippingAddress.country}</Typography>
                            <Typography >{shippingAddress.phone}</Typography>

                            <Divider sx={{ my: 1 }} />

                            <OrderSummary
                                orderValues={{
                                    numberOfItems,
                                    subTotal,
                                    tax,
                                    total
                                }}
                            />

                            <Box display="flex" flexDirection="column" sx={{ flex: 1 }}>
                                {
                                    order.isPaid
                                        ? (
                                            <Chip
                                                sx={{ my: 2 }}
                                                label="Orden Pagada Exitosamente"
                                                variant="outlined"
                                                color="success"
                                                icon={<CreditScoreOutlined />}
                                            />
                                        ) : (
                                            <Chip
                                                sx={{ my: 2 }}
                                                label="Pediente de pago"
                                                variant="outlined"
                                                color="error"
                                                icon={<CreditCardOffOutlined />}
                                            />
                                        )
                                }
                            </Box>

                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

        </AdminLayout >
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const { id = '' } = query;

    const order = await dbOrders.getOrderById(id.toString());

    if (!order) {
        return {
            redirect: {
                destination: '/admin/orders',
                permanent: false,
            }
        }
    }

    return {
        props: {
            order,
        }
    }

}

export default OrderPage;

