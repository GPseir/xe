import React from 'react'
import axios from 'axios'
import Popup from './popup'
import Loader from './loader.gif'


class Api extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputText: '',            
            url: '',
            isPopupOpen: false,
            loading: false,
            message: '',
            items: [],
            value: '',
        } 

        this.cancel = '';
    }

    // setting url parameters
    detect_lang = (value) => {
        let engl = /^[A-Za-z0-9 \s]*$/
        let el = /^[ά-ωΑ-ώ0-9 \s]*$/
        let lang = ''
        if (engl.test(value)) {lang = 'en'}
        else if (el.test(value)) {lang = 'el'}
        else {lang = ''}  
        return lang
    }

    set_limit = () => {
        let w = window.innerWidth
        if (w <= 767) {return 10}
        else {return 20}
    }   

    // User typing timer
    userTyping = (e) => {
        let typingTimer;
        let input = document.getElementById('input');

        //on keyup, start the countdown
        input.onkeyup = () => {
        typingTimer = setTimeout( ()=> this.fetchSearchResults(this.state.url), 400);
        };

        //on keydown, clear the countdown 
        input.onkeydown = () => {
        clearTimeout(typingTimer)
        };
    }

    // API call, data fetching
    fetchSearchResults = async (url) => {

        if (this.cancel) {
            this.cancel.cancel();
        }
        this.cancel = axios.CancelToken.source();

        axios.get(url, {
                cancelToken: this.cancel.token,
                timeout: 5*1000,
            })
            .then( res => {                
                const noResultsMsg = ! res.data.entries.length ? 'No search results. Please try a new search.' : ''
                this.setState({ 
                    items: res.data.entries, 
                    message: noResultsMsg,
                    loading: false,
                 })
                console.log(res.data.entries)
                if (!this.state.items.length) {this.hidePopup()}
            })
            .catch( error => {
                if ( (axios.isCancel(error) || error ) ) {
                    console.log('Cancelled or error')
                    const noDataMsg = this.state.inputText ? 'Failed to fetch data. Please check for invalid characters.' : ''
                    this.setState({                        
                        loading: false,
                        message: noDataMsg,
                        isPopupOpen: false,
                        items: []
                    })
                } else {
                    console.log(error);
                }
            })
    }

    
    // Search Input field changes
    onInputChange = (e) => {
        let value = e.target.value;
        let lang = this.detect_lang(value)
        let lim = this.set_limit()
        const baseURL = "http://35.180.182.8/Search"
        let Url = baseURL + `?keywords=${value}&language=${lang}&limit=${lim}`
        
        if ((value.length > 1)) {
            this.btn();
            this.setState({ 
                inputText: value, loading: true, message: '', url: Url
        }, ()=> {this.userTyping()})
        }
        else if (value.length <= 1) {
            this.setState({ inputText: '', message: '', url: '' })
        }
    }

    onInputValue = (e) => {
        const value = e.target.value; 
        if ((value.length > 1)){
        this.showPopup()
        }
        else {
        this.hidePopup()
        }
    }
        
    // Show/ Hide Popup, select location 
    showPopup = () => {
        this.setState({ isPopupOpen: true })
    }

    hidePopup = () => {
        this.setState({ isPopupOpen: false })
    }

    locationSelected = (e) => {
        this.setState({ value: e.target.innerHTML })
        let inputF = document.getElementById('input')
        inputF.value = e.target.innerHTML
        this.hidePopup()
    }

    // Search Button disable/ clicked
    btn = () => {
        const btn = document.getElementById("btn")
        if (!this.state.items.length || !this.state.inputText) {btn.disabled = true;}
        else if (this.state.items.length) {btn.disabled = false}
    }

    btn_clicked = () => {
        let textInput = document.getElementById('input');
        let loc = textInput.value
        window.open(`http://www.google.com/search?hl=en&q= + ${loc}`);
        textInput.value = ''
        this.setState({ inputText: '', isPopupOpen: false })
    }

    

    render() {     
        const { isPopupOpen, items, loading, message, inputText } = this.state     
            return(
                <div className='grid-container'>         

                        {/* Banner and Logo        */}                
                        <div className='grid-banner'><p>Banner space</p></div>
                        <div className='grid-logo'>
                        <img src={"./logo.png"} alt='logo' height='100' width='100'/>
                        </div>

                        {/* SearchBox               */}
                        <div className='grid-main search'>
                            <div className='grid-searchText'>
                                <h3 className='title'>What place are you looking for?</h3>                            
                            </div>

                            <div className='grid-searchBox search-container'>
                                
                                {/* SearchBar*/}
                                <i className="fa fa-search search-icon" ></i>
                                <input 
                                    type="search" placeholder='Search' id='input' className='input-search'       
                                    onChange={this.onInputChange}
                                    onKeyUp={this.onInputValue}
                                    />
                                    
                                <i className="fa fa-microphone mic-icon"></i>

                                {/* Loader */}
                                <img height="150" width="150" src={Loader} id='search-loader' className={`${ loading ? 'show' : 'hide'}`} alt='loader'/>

                                {/* Popup */}
                                <Popup isOpen={isPopupOpen} items={items} locationSelected={this.locationSelected}
                                loading={loading}
                                />

                                {/* Messages */}
                                {message && <p className='message'> {message} </p>}
                                {!inputText &&                             
                                <div className='text'> 
                                    <div> 1) Please enter over 1 valid characters.
                                    </div>
                                    <div> 2) Choose a location from the list
                                    </div>
                                    <div> 3) Click the button to search for more information </div>
                                </div>}

                        </div>

                        {/* Search Button */}
                        <div className='grid-searchButton' onMouseMove={this.btn}>
                            <button className={(this.state.inputText && this.state.items.length) ? "click-button": "click-button disabled"} type="button" id='btn' onClick={this.btn_clicked}>Click to search</button>
                        </div> 
                    </div>

                    <div className='grid-empty'></div>           
                </div>  
            )
    }
}

export default Api
