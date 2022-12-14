// Imports requeridos
import React, { Component } from "react";
import './style.scss';
import Input from '../../../../../components/Input';
import Button from '../../../../../components/Button';
import Checkbox from '../../../../../components/Checkbox';
import Select from '../../../../../components/Select';
import IssueService from '../../../../../services/issue.service';
import { getAppId } from '../../../apps/components/helpers/variables';
import { getShowIssueForm, setShowIssueForm, setIssue, getIssue } from '../helpers/variables';
import TextArea from "../TextArea";

// Clase para mostrar un formulario pop-up para un issue
export default class IssueForm extends Component{
    // Constructor de la clase
    constructor(props){
        super(props)

        // Inicializamos variables de estado
        this.state = {
            name: '', 
            description: '', 
            testedBy: '', 
            severity: 'Low', 
            preRequisites: [], 
            steps: [], 
            expectedResult: '',
            currentResult: '', 
            reproducibilityRate: '1', 
            technicalFeedback: '', 
            additionalInformation: '',
            url: '', 
            issue_category: '1', 
            isSolved: false,
            categoryAux: 'Player',

            // Me declaro variable auxiliar para no hacer una llamada a función cada vez que seleccione un valor
            issueCategoriesList: this.getIssueCategories()
        }
    }

    // Para traer la de API la lista desplegable de categorías
    getIssueCategories(){
        let categories = [];
        IssueService.getIssueCategories()
            .then((response) => {
                response.data.data.map(value => categories.push(value.name))
                this.setState({issueCategoriesList: categories})
            })
            .catch((error) => {
                console.log(error);
            });

        return categories
    }

    // Método que se ejecuta al enviar el formulario
    onSubmit = (e) => {
        // Desestructuramos variables y objetos del estado
        const { 
            name, description, testedBy, severity, preRequisites, steps, expectedResult,
            currentResult, reproducibilityRate, technicalFeedback, additionalInformation,
            url, issue_category, isSolved, id
        } = this.state;

        e.preventDefault();

        // Declaro el objecto que vamos a enviar a la API
        const issue = {name, description, testedBy, severity, preRequisites, steps, expectedResult,
            currentResult, reproducibilityRate, technicalFeedback, additionalInformation,
            url, issue_category, isSolved, id}

        console.log('Enviado -> ', issue)

        this.props.newIssue(issue)

        window.location.href = `/dashboardpc/management/apps/${getAppId()}`;
        setShowIssueForm()
    }

    // Método para ocultar el formulario al pulsar botón de cerrar
    close = () => {
        const modal = document.getElementById('issueForm')
        modal.style.display = 'none'

        setShowIssueForm()
        this.props.setShow(getShowIssueForm())
        setIssue('')
    }

    // Actualizar valor de entradas de texto
    handleInputChange = (value, field) => {
        this.setState({
            [field]: value
        });

        if (field == 'preRequisites' || field == 'steps'){
            const valueItem = value.split(', ')
            console.log(valueItem)
            this.setState({ [field]: valueItem });
        }

        //console.log(fieldState, ' => ', value);
    };

    // Actualizar valor de los Checkbox
    onLiftState = (state) => {
        const { name, isChecked } = state;
        this.setState({ [name]: isChecked });

        //console.log(name, ' => ', isChecked);
    };

    // Actualizar valor de un Select
    onChangeInput = (value, field) => {
        this.setState({ [field]: value });

        if (field == 'categoryAux'){
            if (value == 'Player')
                this.setState({issue_category: '1'})
            else if (value == 'Navigation')
                this.setState({issue_category: '2'})
            else if (value == 'Requests-Responses')
                this.setState({issue_category: '3'})
            else if (value == 'Back-Button')
                this.setState({issue_category: '4'})
            else if (value == 'Resolution')
                this.setState({issue_category: '5'})
            else
                this.setState({issue_category: '6'})
        } 
    };

    // Método que se ejecuta cuando el componente ha sido montado
    componentDidMount(){
        const issue = getIssue()

        if (issue != ''){
            this.setState({
                name: issue.name, 
                description: issue.description, 
                testedBy: issue.testedBy, 
                severity: issue.severity, 
                preRequisites: issue.preRequisites, 
                steps: issue.steps, 
                issue_category: issue.issue_category,
                expectedResult: issue.expectedResult,
                currentResult: issue.currentResult, 
                reproducibilityRate: issue.reproducibilityRate, 
                technicalFeedback: issue.technicalFeedback, 
                additionalInformation: issue.additionalInformation,
                url: issue.url, 
                isSolved: issue.isSolved,
                id: issue.id,
                categoryAux: issue.issue_category
            })
        }
    }

    // Método que se ejecuta al cargar el componente
    render(){
        // Declaramos variables que vamos a usar
        const { 
            name, description, testedBy, severity, preRequisites, steps, expectedResult,
            currentResult, reproducibilityRate, technicalFeedback, additionalInformation,
            url, categoryAux, isSolved
        } = this.state;

        // Formulario para issues
        return(
            <form className='issueForm' onSubmit={this.onSubmit} id='issueForm'>
                <div className='content'>
                    <button type="button" className="btn-close" aria-label="Close" onClick={this.close}/>
                    <div className="secTitle">New Issue</div>
                    <div className='inputs'>
                        <Input
                            title = 'Name'
                            value = {name}
                            inputStyle = '2'
                            onInputTextChange={(value) => {
                                this.handleInputChange(value, 'name');
                            }}
                        />
                        <TextArea
                            title = 'Description'
                            value = {description}
                            inputStyle = '3'
                            onInputTextChange={(value) => {
                                this.handleInputChange(value, 'description');
                            }}
                        />
                        <Input
                            title = 'Tested By'
                            value = {testedBy}
                            inputStyle = '2'
                            onInputTextChange={(value) => {
                                this.handleInputChange(value, 'testedBy');
                            }}
                        />
                        <Select
                            label="Severity:"
                            option={severity}
                            optionsList={['Low', 'Mid', 'High']}  
                            onChangeOption={(e) => {
                                this.onChangeInput(e, 'severity');
                            }}
                        />
                        <Input
                            title = 'Prerequisites'
                            value = {preRequisites.join(', ')}
                            inputStyle = '2'
                            onInputTextChange={(value) => {
                                this.handleInputChange(value, 'preRequisites');
                            }}
                        />
                        <TextArea
                            title = 'Steps'
                            value = {steps.join(', ')}
                            inputStyle = '3'
                            onInputTextChange={(value) => {
                                this.handleInputChange(value, 'steps');
                            }}
                        />
                        <Input
                            title = 'Expected Result'
                            value = {expectedResult}
                            inputStyle = '2'
                            onInputTextChange={(value) => {
                                this.handleInputChange(value, 'expectedResult');
                            }}
                        />
                        <Input
                            title = 'Current Result'
                            value = {currentResult}
                            inputStyle = '2'
                            onInputTextChange={(value) => {
                                this.handleInputChange(value, 'currentResult');
                            }}
                        />
                        <Select
                            label="Reproducibility Rate:"
                            option={reproducibilityRate}
                            optionsList={['1', '2', '3', '4', '5']}  
                            onChangeOption={(e) => {
                                this.onChangeInput(e, 'reproducibilityRate');
                            }}
                        />
                        <TextArea
                            title = 'Technical Feedback'
                            value = {technicalFeedback}
                            inputStyle = '3'
                            onInputTextChange={(value) => {
                                this.handleInputChange(value, 'technicalFeedback');
                            }}
                        />
                        <Input
                            title = 'Additional Information'
                            value = {additionalInformation}
                            inputStyle = '2'
                            onInputTextChange={(value) => {
                                this.handleInputChange(value, 'additionalInformation');
                            }}
                        />
                        <Input
                            title = 'URL'
                            value = {url}
                            inputStyle = '2'
                            onInputTextChange={(value) => {
                                this.handleInputChange(value, 'url');
                            }}
                        />
                        <Select
                            label="Issue Category:"
                            option={categoryAux}
                            optionsList={this.state.issueCategoriesList}  
                            onChangeOption={(e) => {
                                this.onChangeInput(e, 'categoryAux');
                            }}
                        />
                        <div><Checkbox name="isSolved" liftState={this.onLiftState} isChecked={isSolved} /> Is Solved</div>
                    </div>
                    <Button name={(getIssue() == '') ? "Add New Issue" : 'Edit Issue'} type="submit" className='submitButton'>
                        <input type="submit" />
                    </Button>
                </div>
            </form>
        )
    }
}