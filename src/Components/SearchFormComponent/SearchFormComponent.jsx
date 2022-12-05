import React from "react"
import { InputComponent } from "../SearchComponent/InputComponent"
import './SearchFormComponent.css'

function SearchFormComponent( { searchTerm, onSearchInput, onSearchSubmit} ){
    return (
        <div>
            <form className="search-form" onSubmit={onSearchSubmit}>
                <InputComponent id={'search'} type='text' value = { searchTerm } handleSearch = { onSearchInput } isFocused > <strong> Search: </strong> </InputComponent>
                <button className="button button-large" disabled={ !searchTerm }>Submit</button>
            </form>
        </div>
    )
}

export default SearchFormComponent