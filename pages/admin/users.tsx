import { testloApi } from "@component/api";
import { AdminLayout } from "@component/components/layouts";
import { IUser } from "@component/interfaces";
import { PeopleOutline } from "@mui/icons-material";
import { Grid, MenuItem, Select } from "@mui/material";

import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import useSWR from 'swr';


const UsersPage = () => {

    const { data, error } = useSWR<IUser[]>('/api/admin/users');
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        if (data) {
            setUsers(data);
        }
    }, [data]);


    if (!data && !error) {
        return (<></>);
    }

    const onRolUpdated = async (userId: string, newRole: string) => {

        const previosUsers = users.map(user => ({ ...user }));
        const updatedUsers = users.map(user => ({
            ...user,
            role: userId === user._id ? newRole : user.role
        }));

        setUsers(updatedUsers);

        try {
            await testloApi.put('/admin/users', { userId, role: newRole });
        } catch (error) {
            setUsers(previosUsers);
            console.log(error);
            alert('No se pudo actualizar el rol del usuario');
        }
    }

    const columns: GridColDef[] = [
        { field: 'email', headerName: 'Correo', width: 250 },
        { field: 'name', headerName: 'Nombre completo', width: 300 },
        {
            field: 'role',
            headerName: 'Rol',
            width: 300,
            renderCell: ({ row }: GridCellParams) => {
                return (
                    <Select
                        value={row.role}
                        label='Rol'
                        onChange={({ target }) => onRolUpdated(row.id, target.value)}
                        sx={{ width: '300px' }}
                    >
                        <MenuItem value='admin'>Admin</MenuItem>
                        <MenuItem value='client'>Cliente</MenuItem>
                        <MenuItem value='super-user'>Super Usuario</MenuItem>
                        <MenuItem value='SEO'>SEO</MenuItem>
                    </Select>
                )
            }
        },
    ];

    const rows = data!.map(user => ({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
    }));

    return (
        <AdminLayout
            title={'Usuarios'}
            subTitle={'Mantenimiento usuarios'}
            icon={<PeopleOutline />}
        >
            <Grid container className="fadeIn">
                <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSizeOptions={[25]}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 25,
                                },
                            },
                        }}
                    />

                </Grid>
            </Grid>

        </AdminLayout>
    )
}

export default UsersPage;