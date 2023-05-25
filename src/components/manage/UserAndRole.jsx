import { Button, Modal, Table } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import Header from './Header'
import Slidebar from './Slidebar'
import API, { authAxios, endpoints } from '../../API';
import { Link } from 'react-router-dom';
import { Pagination } from 'evergreen-ui';
import { useTranslation } from 'react-i18next';
import { STATUS_200_OK } from "../const/data_const"

function UserAndRole() {

    const [userList, setUserList] = useState([]);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageTotal, setPageTotal] = useState(1);
    const [t] = useTranslation("common");

    useEffect(() => {

        authAxios().get(endpoints['users-pagination'](0)).then(res => {
            
            if (res.status === STATUS_200_OK) {

                setUserList(res.data.content);
                setPageTotal(res.data.totalPages);
            }
        }
        ).catch(err => console.log(err));
    }, []);

    const handlePageChange = (pageNumberChangeTo) => {
        setPageNumber(pageNumberChangeTo);
        let url = endpoints['users-pagination'](pageNumberChangeTo - 1);

        authAxios().get(url).then(res => {
            setUserList(res.data.content);
        }
        ).catch(err => console.log(err));
    }

    const handleNextPage = (pageNumber) => {

        setPageNumber(pageNumber + 1);

        handlePageChange(pageNumber + 1);
    }

    const handlPrevPage = (pageNumber) => {

        setPageNumber(pageNumber - 1);

        handlePageChange(pageNumber - 1);
    }

    return (
        <div className='w-full relative m-auto min-h-screen text-base'>
            {/* header */}
            <Header />
            {/* wrapper content */}
            <div className='h-full overflow-hidden'>
                {/* left navbar */}
                <Slidebar />
                {/* content */}
                <div className='ml-[251px] mr-4'>
                    <div className='flex justify-center my-4'>
                        <h1 className='uppercase font-bold text-3xl'>
                            {t("user-role.management-user")}
                        </h1>
                    </div>
                    <div className='flex justify-between'>
                        <Pagination page={pageNumber} totalPages={pageTotal} onPageChange={(evt) => handlePageChange(evt)} onPreviousPage={() => handlPrevPage(pageNumber)} onNextPage={() => handleNextPage(pageNumber)}></Pagination>
                        <div className='mx-4 my-4 flex justify-end'>
                            <div className='bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer'>
                                <Link to='/management/create-user-role'><span>+ {t("user-role.create-user")}</span></Link>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-center'>
                        <Table striped={true} className='mx-4 w-[200px]'>
                            <Table.Head>
                                <Table.HeadCell>
                                    {t("user-role.user-username")}
                                </Table.HeadCell>
                                <Table.HeadCell>
                                    {t("user-role.user-role")}
                                </Table.HeadCell>
                                <Table.HeadCell colSpan={2}>
                                    {t("user-role.user-function")}
                                </Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {
                                    userList.map(item =>
                                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                {item.username}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {item.userRole}
                                            </Table.Cell>
                                            <Table.Cell width={120}>
                                                <Button><Link to={"/management/edit-user-role/" + item.id}
                                                    className="font-medium">{t("user-role.edit")}</Link></Button>
                                            </Table.Cell>
                                            <Table.Cell width={120}>
                                                <div className='flex'>
                                                    <Button color="failure" onClick={() => setDeleteModalVisible(true)}>
                                                        {t("user-role.delete")}
                                                    </Button>
                                                    <Modal
                                                        show={deleteModalVisible}
                                                        size="md"
                                                        popup={true}
                                                        onClose={() => setDeleteModalVisible(false)}
                                                    >
                                                        <Modal.Header />
                                                        <Modal.Body>
                                                            <div className="text-center">
                                                                <div className='flex justify-center'>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                                                        className="w-12 h-12">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                                                                    </svg>
                                                                </div>
                                                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                                                    {t("user-role.delete-user-header")}
                                                                </h3>
                                                                <div className="flex justify-center gap-4">
                                                                    <Button
                                                                        color="failure"
                                                                        onClick={() => setDeleteModalVisible(false)}
                                                                    >
                                                                        {t("user-role.yes")}
                                                                    </Button>
                                                                    <Button
                                                                        color="gray"
                                                                        onClick={() => setDeleteModalVisible(false)}
                                                                    >
                                                                        {t("user-role.no")}
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </Modal.Body>
                                                    </Modal>
                                                </div>
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                }
                            </Table.Body>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserAndRole