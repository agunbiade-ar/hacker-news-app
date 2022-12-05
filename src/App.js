// import logo from './logo.svg';
import './App.css';
import { List } from './Components/ListComponent/ListComponent';
import SearchFormComponent from './Components/SearchFormComponent/SearchFormComponent';
import { useState, useEffect, useReducer, useCallback } from 'react';
import storiesReducer from './storiesReducer';
import axios from 'axios';

// const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';
const API_BASE = `https://hn.algolia.com/api/v1`
const API_SEARCH = `/search`;
const PARAM_SEARCH = `query=`
const PARAM_PAGE = `page=`

const getUrl = (searchTerm_, page) => `${API_BASE}${API_SEARCH}?${PARAM_SEARCH}${searchTerm_}&${PARAM_PAGE}${page}`;

function App() {
  
  const useSemiPersistentState = ( key, initialValue ) => {
    const [ value, setValue ] = useState(localStorage.getItem(key) || initialValue )
    
    useEffect( function(){
      localStorage.setItem(key, value)
  },[ key, value ])
 
  return [value, setValue ]
}

  const [storiesList, dispatchStories] = useReducer( storiesReducer, { data: [], page:0, isLoading: false, isError: false } )
  const [searchTerm, setSearchTerm ] = useSemiPersistentState('search', 'React')

  const [ urls, setUrls ] = useState( [ getUrl(searchTerm, storiesList.page) ])

  const onSearchInput = e => {
    setSearchTerm(e.target.value)
  }

  const handleSearchSubmit = ( e ) => {
    e.preventDefault()
    handleSearch( searchTerm, 0 ) 
    
  }

  function handleRemoveStory( item ){
     dispatchStories( { type: 'REMOVE_STORY', payload: item} )
  }

const handleFetchStories = useCallback( async () => {

      dispatchStories( { type: 'STORIES_FETCH_INIT'} )
    
      try {
        const lastUrl = urls[ urls.length - 1 ]

        const result = await axios.get(lastUrl)
          dispatchStories( {type: 'STORIES_FETCH_SUCCESS', payload: {list: result.data.hits, page: result.data.page} }  )
      } catch (error) {
          dispatchStories( {type: 'STORIES_FETCH_FAILURE'})
      }
    }, [ urls ])

    const extractSearchTerm = url => url.substring(url.lastIndexOf('?') + 1, url.lastIndexOf('&')).replace(PARAM_SEARCH, '')
    
    const getLastSearches = urls => urls.reduce( (accumulator_array, current_url, index) => {
      const searchTerm_ = extractSearchTerm( current_url )

      if( index === 0 ){
         return accumulator_array.concat( searchTerm_ )
      }

      const previousSearchTerm = accumulator_array[ accumulator_array.length - 1]

      if( searchTerm_ === previousSearchTerm){
        return accumulator_array
      }else{
        return accumulator_array.concat( searchTerm_ )
      }

    }, []).slice( -6 ).slice(0, -1)
    
    const lastSearches = getLastSearches( urls )

    const handleLastSearch = searchTerm_ => {
        handleSearch( searchTerm_, 0 )
    }

    useEffect( () => {
        handleFetchStories()

    }, [ handleFetchStories ])
    
    const handleSearch = (searchTerm_, page) => {

      const url = getUrl(searchTerm_, page)

      if( !urls.includes( url ))
        setUrls( urls.concat( url ) )
      }

      function handleMore(){
        const lastUrl = urls[urls.length - 1]
        const searchTerm = extractSearchTerm( lastUrl )
        handleSearch( searchTerm, storiesList.page + 1)
      }

  return (
    <div className='container'>
      <h1 className='headline-primary'>My Hacker Stories</h1>
   
      <SearchFormComponent searchTerm = { searchTerm } onSearchInput = { onSearchInput } onSearchSubmit ={ handleSearchSubmit }  />

      {
        lastSearches.map( (searchTerm_, index) => <button key={ index } onClick={ () => handleLastSearch( searchTerm_ ) } > { searchTerm_ } </button>)
      }

   { storiesList.isError ? (<p> Something went horribly wrong! </p>) : 
   
    <div>
      <List list = { storiesList.data } onRemoveItem = { handleRemoveStory } />

      { storiesList.isLoading ? (<p> Loading... </p>) : 
                    ( <button onClick={ handleMore }> More </button> )
      }
      
    </div>
  }
  </div>
  )
}

export default App;
