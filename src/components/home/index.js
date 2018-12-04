import React, { Component } from 'react';
import axios from 'axios';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: [],
            isLoading: true,
            inputName: '',
            inputEmail: '',
            editID: '',
            editName: '',
            editEmail: '',
            isLoadingEdit: false,
            isLoadingDelete: false,
            currentPage: 1,
            perPage: 10,
            totalPage: 0
        }
    }

    componentDidMount = () => {
        this.getUserData();
    }

    getUserData = () => {
        const self = this;
        axios.get('https://restful-c8ce2.firebaseapp.com/api/users').then(function (response) {
            self.pagePagination(response.data.result);
            self.setState({
                userData: response.data.result,
                isLoading: false
            });
        });
    }

    getUserDataByID = (userID) => {
        const self = this;
        axios.get('https://restful-c8ce2.firebaseapp.com/api/users/'+userID).then(function (response) {
            self.setState({
                editName: response.data.result.name,
                editEmail: response.data.result.email,
                isLoadingEdit: false,
                isLoadingDelete: false
            });
        });
    }

    createUserData = (addUserData) => {
        const self = this;
        axios.post('https://restful-c8ce2.firebaseapp.com/api/users', addUserData).then(function (response) {
            self.setState({
                inputName: '',
                inputEmail: ''
            });
            self.getUserData();
        });
    }

    updateUserData = (userID, editUserData) => {
        const self = this;
        axios.put('https://restful-c8ce2.firebaseapp.com/api/users/'+userID, editUserData).then(function (response) {
            self.setState({
                editID: '',
                editName: '',
                editEmail: ''
            });
            self.getUserData();
        });
    }

    deleteUserData = (userID) => {
        const self = this;
        axios.delete('https://restful-c8ce2.firebaseapp.com/api/users/'+userID).then(function (response) {
            self.setState({
                editID: ''
            });
            self.getUserData();
        });
    }
    
    onChangeName = (event) => {
        this.setState({
            inputName: event.target.value
        });
    }

    onChangeEmail = (event) => {
        this.setState({
            inputEmail: event.target.value
        });
    }

    onClickAdd = (event) => {
        event.preventDefault();
        if (this.state.inputName !== '' && this.state.inputEmail !== '') {
            const addUserData = {
                'name': this.state.inputName,
                'email': this.state.inputEmail
            };
            this.setState({
                isLoading: true
            }, () => {
                this.createUserData(addUserData);
            });
            
        }
    }

    onClickEditButton = (event) => {
        event.preventDefault();
        this.setState({
            editID: event.target.value,
            isLoadingEdit: true
        }, () => {
            this.getUserDataByID(this.state.editID);
        });
    }
    
    onChangeEditName = (event) => {
        this.setState({
            editName: event.target.value
        });
    }

    onChangeEditEmail = (event) => {
        this.setState({
            editEmail: event.target.value
        });
    }

    onClickEdit = (event) => {
        event.preventDefault();
        if (this.state.editID !== '' && this.state.editName !== '' && this.state.editEmail !== '') {
            const editUserData = {
                'name': this.state.editName,
                'email': this.state.editEmail
            };
            this.setState({
                isLoading: true
            }, () => {
                this.updateUserData(this.state.editID, editUserData);
            });
        }
    }

    onClickDeleteButton = (event) => {
        event.preventDefault();
        this.setState({
            editID: event.target.value,
            isLoadingDelete: true
        }, () => {
            this.getUserDataByID(this.state.editID);
        });
    }

    onClickDelete = (event) => {
        event.preventDefault();
        if (this.state.editID !== '' && this.state.editName !== '' && this.state.editEmail !== '') {
            this.setState({
                isLoading: true
            }, () => {
                this.deleteUserData(this.state.editID);
            });
        }
    }

    pagePagination = (userData) => {
        const totalPage = Math.ceil((userData.length)/(this.state.perPage));
        this.setState({
            totalPage: totalPage
        });
    }

    onClickPagePrev = (event) => {
        event.preventDefault();
        if (this.state.currentPage > 1) {
            this.setState(prevState => ({
                currentPage: prevState.currentPage - 1
            }));
        }
    }

    onClickPageNext = (event) => {
        event.preventDefault();
        if (this.state.currentPage < this.state.totalPage) {
            this.setState(prevState => ({
                currentPage: prevState.currentPage + 1
            }));
        }
    }

    render() {
        let displayTable;
        let saveButton;
        let editButton;
        let deleteButton;
        let displayEditModal;
        let displayDeleteModal;
        let prevPageButton;
        let nextPageButton;
        if (this.state.isLoading === true) {
            displayTable = (
                <div className="container-fluid" style={{paddingTop: '20px'}}>
                    <div className="text-center">
                        <p>... Loading ...</p>
                    </div>
                </div>
            );
        } else {
            if (this.state.inputName !== '' && this.state.inputEmail !== '') {
                saveButton = (
                    <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.onClickAdd}>Save</button>
                );
            } else {
                saveButton = (
                    <button type="button" className="btn btn-secoundary" data-dismiss="modal" disabled>Save</button>
                );
            }
            if (this.state.isLoadingEdit === true) {
                displayEditModal = (
                    <form>
                        <div className="form-group">
                            <label htmlFor="idEdit">ID</label>
                            <input type="text" className="form-control" id="idEdit" value={this.state.editID} disabled />
                        </div>
                        <div className="text-center">
                            <p>... Loading ...</p>
                        </div>
                    </form>
                );
            } else {
                displayEditModal = (
                    <form>
                        <div className="form-group">
                            <label htmlFor="idEdit">ID</label>
                            <input type="text" className="form-control" id="idEdit" value={this.state.editID} disabled />
                        </div>
                        <div className="form-group">
                            <label htmlFor="nameEdit">Name</label>
                            <input type="text" className="form-control" id="nameEdit" placeholder="Enter name" onChange={this.onChangeEditName} value={this.state.editName} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="emailEdit">E-mail address</label>
                            <input type="text" className="form-control" id="emailEdit" placeholder="Enter e-mail" onChange={this.onChangeEditEmail} value={this.state.editEmail} />
                        </div>
                    </form>
                );
            }
            if (this.state.isLoadingDelete === true) {
                displayDeleteModal = (
                    <form>
                        <div className="form-group">
                            <label htmlFor="idEdit">ID</label>
                            <input type="text" className="form-control" id="idEdit" value={this.state.editID} disabled />
                        </div>
                        <div className="text-center">
                            <p>... Loading ...</p>
                        </div>
                    </form>
                );
            } else {
                displayDeleteModal = (
                    <form>
                        <div className="form-group">
                            <label htmlFor="idEdit">ID</label>
                            <input type="text" className="form-control" id="idEdit" value={this.state.editID} disabled />
                        </div>
                        <div className="form-group">
                            <label htmlFor="nameEdit">Name</label>
                            <input type="text" className="form-control" id="nameEdit" placeholder="Enter name" value={this.state.editName} disabled />
                        </div>
                        <div className="form-group">
                            <label htmlFor="emailEdit">E-mail address</label>
                            <input type="text" className="form-control" id="emailEdit" placeholder="Enter e-mail" value={this.state.editEmail} disabled />
                        </div>
                    </form>
                );
            }
            if (this.state.editID !== '' && this.state.editName !== '' && this.state.editEmail !== '' && this.state.isLoadingEdit === false) {
                editButton = (
                    <button type="button" className="btn btn-warning" data-dismiss="modal" onClick={this.onClickEdit}>Save</button>
                );
            } else {
                editButton = (
                    <button type="button" className="btn btn-secoundary" data-dismiss="modal" disabled>Save</button>
                );
            }
            if (this.state.editID !== '' && this.state.editName !== '' && this.state.editEmail !== '' && this.state.isLoadingDelete === false) {
                deleteButton = (
                    <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={this.onClickDelete}>Delete</button>
                );
            } else {
                deleteButton = (
                    <button type="button" className="btn btn-secoundary" data-dismiss="modal" disabled>Delete</button>
                );
            }
            if (this.state.currentPage > 1) {
                prevPageButton = (
                    <li className="page-item">
                        <button className="page-link" onClick={this.onClickPagePrev}>Previous</button>
                    </li>
                );
            } else {
                prevPageButton = (
                    <li className="page-item disabled">
                        <button className="page-link" onClick={this.onClickPagePrev}>Previous</button>
                    </li>
                );
            }
            if (this.state.currentPage < this.state.totalPage) {
                nextPageButton = (
                    <li className="page-item">
                        <button className="page-link" onClick={this.onClickPageNext}>Next</button>
                    </li>
                );
            } else {
                nextPageButton = (
                    <li className="page-item disabled">
                        <button className="page-link" onClick={this.onClickPageNext}>Next</button>
                    </li>
                );
            }
            displayTable = (
                <div className="container-fluid">
                    <div className="text-right" style={{paddingTop: '20px'}}>
                        <button type="button" className="btn btn-success" data-toggle="modal" data-target="#addModal">Add a new user</button>
                    </div>
                    <div className="text-center" style={{paddingTop: '20px'}}>
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead className="thead-dark">
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">E-mail</th>
                                        <th scope="col">*</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.userData.slice((this.state.currentPage-1)*this.state.perPage, ((this.state.currentPage-1)+1)*this.state.perPage).map((item, i) =>{
                                        return (
                                            <tr key={item.id}>
                                                <th scope="row">{item.id}</th>
                                                <td>{item.name}</td>
                                                <td>{item.email}</td>
                                                <td>
                                                    <button type="button" className="btn btn-warning" value={item.id} onClick={this.onClickEditButton} data-toggle="modal" data-target="#editModal" style={{width: '70px'}}>Edit</button>
                                                    <button type="button" className="btn btn-danger" value={item.id} onClick={this.onClickDeleteButton} data-toggle="modal" data-target="#deleteModal" style={{width: '70px'}}>Delete</button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="text-center" style={{paddingTop: '20px'}}>
                        <p>Page {this.state.currentPage} of {this.state.totalPage}</p>
                        <nav aria-label="Page navigation example">
                            <ul className="pagination justify-content-center">
                                { prevPageButton }
                                { nextPageButton }
                            </ul>
                        </nav>                                           
                    </div>

                    <div className="modal fade" id="addModal" tabIndex="-1" role="dialog" aria-labelledby="addModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="addModalLabel">Add a new user</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-group">
                                        <label htmlFor="nameInput">Name</label>
                                        <input type="text" className="form-control" id="nameInput" placeholder="Enter name" onChange={this.onChangeName} value={this.state.inputName} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="nameInput">E-mail address</label>
                                        <input type="text" className="form-control" id="emailInput" placeholder="Enter e-mail" onChange={this.onChangeEmail} value={this.state.inputEmail} />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                { saveButton }
                            </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal fade" id="editModal" tabIndex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="editModalLabel">Edit a user details</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                { displayEditModal }
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                { editButton }
                            </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal fade" id="deleteModal" tabIndex="-1" role="dialog" aria-labelledby="deleteModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="deleteModalLabel">Delete a user</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                { displayDeleteModal }
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                { deleteButton }
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className="container" style={{paddingTop: '60px', paddingBottom: '60px'}}>
                { displayTable }
            </div>
        );
    }
}

export default Home;