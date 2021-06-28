import React, {Component} from 'react'



type NewYorkTimesState= {
    searchTerm: string,
    startDate: string,
    endDate:string,
    pageNumber: number,
    articles: IArticles[]
        
    
}
interface IArticles{
    headline: {main:string,}
    web_url: string,
    keywords: Array<{value:string}>,
    multimedia: Array<{
        url:string
    }> 
};

type  AcceptedProps= {
}

class NYT extends Component<AcceptedProps,NewYorkTimesState>{
    constructor(props:AcceptedProps){
        super(props)
        this.state = {
            searchTerm:'',
            startDate:'',
            endDate: '',
            pageNumber: 0,
            articles: []
        }
        this.fetchArticles = this.fetchArticles.bind(this)
        this.searchTermUpdate = this.searchTermUpdate.bind(this)
        this.startDateUpdate = this.startDateUpdate.bind(this)
        this.endDateUpdate = this.endDateUpdate.bind(this)
        this.previousPageNumber = this.previousPageNumber.bind(this)
        this.nextPageNumber = this.nextPageNumber.bind(this)
    }

    searchTermUpdate(e:{target:{value:string}}){
        this.setState({
            searchTerm: e.target.value
        })
    }
    startDateUpdate(e:{target:{value:string}}){
        this.setState({
            startDate: e.target.value
        })
    }
    endDateUpdate(e:{target:{value:string}}){
        this.setState({
            endDate: e.target.value
        })
    }

    fetchArticles(){
        let baseURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json'
        let apiKey = 'bXpeNBhYtDsIBx8nSVNXuTvAV1fvZ4A9'
        let urlFetch = `${baseURL}?api-key=${apiKey}&page=${this.state.pageNumber}&q=${this.state.searchTerm}`
        
        if(this.state.startDate !== ''){
            urlFetch += `&begin_date=${this.state.startDate}` 
        }
        if(this.state.endDate !== ''){
            urlFetch += `&end_date=${this.state.endDate}` 
        }
        console.log(urlFetch);
        

        fetch(urlFetch)
        .then (res => res.json())
        .then (result =>{
            let results = result.response.docs
            this.setState({
                articles:results                
            }, () =>{console.log(this.state.articles)})
            }).catch(err => console.log (err))
    }

    nextPageNumber(){

        this.setState({
            pageNumber: this.state.pageNumber + 1
        },this.fetchArticles)
    }

    previousPageNumber(){
        this.setState({
            pageNumber: this.state.pageNumber - 1
        },this.fetchArticles)
    }
    

render(){
    return(
        <div>
            <h1>NY Times Article Search</h1>
            <div>
                <form>
                    <label htmlFor="search">Enter a SINGLE search term (required): </label>
                    <input type="text" id="search" className="search" required value= {this.state.searchTerm} onChange={(event) =>this.searchTermUpdate(event)}/>
                
                    <label htmlFor="start-date">Enter a start date (format YYYYMMDD): </label>
                    <input type="date" id="start-date" className="start-date" pattern="[0-9]{8}" value= {this.state.startDate} onChange={(event) =>this.startDateUpdate(event)}/>
                
                    <label htmlFor="end-date">Enter an end date (format YYYYMMDD): </label>
                    <input type="date" id="end-date" className="end-date" pattern="[0-9]{8}" value= {this.state.endDate} onChange={(event) =>this.endDateUpdate(event)}/>
               
                    <button className="submit"onClick={e=>{e.preventDefault(); this.fetchArticles()}}>Submit search</button>
                </form>
            </div>
            <div style= {{visibility: this.state.articles.length === 0 ? "hidden" : "visible"}} >
                <h1>Results</h1>
                
                <button onClick={() =>this.previousPageNumber()} style= {{visibility: this.state.pageNumber === 0 ? "hidden" : "visible"}}>Previous 10</button>
                <button onClick={() =>this.nextPageNumber()} style= {{visibility: this.state.articles.length < 10 ? "hidden" : "visible"}}>Next 10</button> 
                
                {this.state.articles.map((article: IArticles) =>{
                    return(  
                        
                    <div>
                        {
                         article.multimedia.length === 0 ? <h3>No image to display.</h3> : <img src={`http://www.nytimes.com/${article.multimedia[0].url}`} alt="No Image"/> 
                        }
                        <h2><a href= {article.web_url}>{article.headline.main}</a></h2>

                        <p>Keywords:{article.keywords.map((word)=>{
                            return(<span>{word.value}</span>)
                        })}</p>
                        <hr/>
                    </div>
                    ) })}
            </div>

        </div>
    )
}
}



export default NYT;