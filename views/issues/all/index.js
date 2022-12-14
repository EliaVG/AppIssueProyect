// Imports requeridos
import React, { Component } from 'react';
import IssueService from '../../../../services/issue.service';
import { getAppId } from '../../apps/components/helpers/variables';
import SpinnerLoading from '../../../../components/SpinnerLoading';
import './style.scss';
import Button from '../../../../components/Button';
import SearchInput from '../../../../components/SearchInput';
import Table from '../../../../components/Table';
import Checkbox from '../../../../components/Checkbox';
import IssueForm from '../components/IssueForm';
import { getShowIssueForm, setShowIssueForm, setIssue } from '../components/helpers/variables';

// Campos a mostrar en la tabla de issues
const AVAILABLE_PROPERTIES = [
    'name',
    'issue_category',
    'severity',
    'testedBy',
    'isSolved'
];

// Clase para mostrar una tabla con todas las issues
export default class AllIssues extends Component{
    // Constructor de la clase
    constructor(props){
        super(props);

        // Inicializamos variables de estado
        this.state = {
            issues: [],
            isIssuesReady: false,
            categories: []
        }

        // Declaramos las cabeceras que mostrará nuestra tabla
        this.tableHeader = [
            { header: 'Name', headerKey: 'name' },
            { header: 'Category', headerKey: 'issue_category' },
            { header: 'Severity', headerKey: 'severity' },
            { header: 'Tested By', headerKey: 'testedBy' },
            { header: 'Is Solved', headerKey: 'isSolvedCheckbox' },
            { header: 'Actions', headerKey: 'actions' }
        ];
    }

    // Método para traer todas los issues de la API
    getAllIssues = () => {
        IssueService.getAllIssues(getAppId())
            .then((response) => {
                this.setState({
                    issues: response.data.data[0].issues,
                    isIssuesReady: true,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // Método para seleccionar la categoria de un issue
    getCategory = () => {
        IssueService.getIssueCategoryAux(getAppId())
            .then((response) => {
                const issueAux = response.data.data.issues
                const categories = []
                issueAux.map(issue => categories.push(issue.issue_category.name))
                this.setState({categories}, ()=>{this.setIssueCategories()})
            })
            .catch((error) => {
                console.log(error);
            });
    }

    // Método que se llama al iniciar la clase
    componentDidMount() {
        this.getAllIssues();
        this.getCategory();
    }

    // Método para encontrar sólo los campos requeridos por la tabla
    issuePropertyMatches = (issue, property, inputText) => {
        if (!Object.prototype.hasOwnProperty.call(issue, property)) {
            return false;
        }
        return `${issue[property]}`.toLowerCase().includes(inputText.toLowerCase());
    };

    // Método para filtrar los valores de la tabla por el valor introducido en input
    filterIssuesBy = (inputText) => {
        const { issues } = this.state;

        return issues.filter((issue) => {
            return !!AVAILABLE_PROPERTIES.find((property) => {
                return this.issuePropertyMatches(issue, property, inputText);
            });
        });
    };

    // Para llamar al método que filtra los campos de la tabla al cambiar el valor en input
    inputTextChange = (inputText) => {
        clearTimeout(this.filteringTO);
        this.filteringTO = setTimeout(() => {
            this.setState({ filteredIssues: this.filterIssuesBy(inputText) });
        }, 500);
    };

    // Método para especificar las acciones a llevar a cabo al pulsar el link
    getIssuesActions(issue, category){
        return (
            // Abrir pop-up formulario para un issue concreto
            <Button id='actionButton' name='Details' onClick={()=>{
                setShowIssueForm(); 
                setIssue(issue)
                //setIssueCategory(category)
                this.setState({showIssueForm: getShowIssueForm()});
            }}/>
        )
    };

    // Método para obtener los datos en la tabla filtrados
    get filteredTable() {
        const { issues, filteredIssues } = this.state;
    
        if (!issues) {
          return [];
        }
        let issuesToUse = filteredIssues;
        if (!issuesToUse || issuesToUse.length < 0) {
            issuesToUse = issues;
        }
        
        return issuesToUse.map((issue) => {
            const { name, severity, issue_category, testedBy, isSolved } = issue;
            
            const isSolvedCheckbox = <Checkbox name="isSolved" isChecked={isSolved} disabled='disabled' />
            const actions = this.getIssuesActions(issue, issue_category);
            
            return {
                name,
                issue_category,
                severity,
                testedBy,      
                isSolvedCheckbox,
                actions,
            };
        });
    }

    // Método para actualizar una issue o añadir una nueva recibida por PROP
    addIssue = (prop) => {
        const issuesAux = this.state.issues

        if(prop.id == undefined){
            issuesAux.push(prop)
            this.setState({issues: issuesAux})

            IssueService.addNewIssue(getAppId(), this.state.issues)
            console.log(this.state.issues)
        }
        else{
            const index = issuesAux.findIndex(issue => issue.id == prop.id)
            issuesAux.splice(index, 1)

            issuesAux.push(prop)
            this.setState({issues: issuesAux})

            IssueService.addNewIssue(getAppId(), this.state.issues)
            console.log(this.state.issues)
        }
    }

    // Método auxiliar para actualizar el valor boolean que decide si se muestra el formulario pop-up
    setShowState = (prop) => {
        this.setState({showIssueForm: prop})
    }

    // Añadir cada issue_category a su correspodiente issue
    setIssueCategories(){
        const {issues} = this.state;
        const categories = this.state.categories
        const issuesAux = issues.map((issue, index)=>{
            return {
                ...issue, 
                issue_category:categories[index]
            }
        })
        this.setState({issues: issuesAux})
    }

    // Método que renderiza el contenido de la tabla al traer todos los issues de la API
    parseContent = () => {
        return (
            <div>
                <div className="search">
                    <Button name="Add New Issue" onClick={() => {setShowIssueForm(); this.setState({showIssueForm: getShowIssueForm()})}}/>
                    <SearchInput onInputTextChange={this.inputTextChange} />
                    <div id="div-table">
                        <Table headersTable={this.tableHeader} dataTable={this.filteredTable} />
                    </div>
                </div>
                {(this.state.showIssueForm) ? <IssueForm newIssue={this.addIssue} setShow={this.setShowState}/> : null}
            </div>
        );
    };

    // Método para renderizar el contenido por defecto de la tabla
    render() {
        const { isIssuesReady } = this.state;
        return (
            <div id="allIssues">
                {!isIssuesReady ? <SpinnerLoading /> : this.parseContent()}
            </div>
        );
    }
}