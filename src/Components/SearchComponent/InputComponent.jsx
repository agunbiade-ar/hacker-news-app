// import { Children } from "react"

export function InputComponent( { id, type, value, handleSearch, children, isFocused }){

    // console.log( children )
    return (
        <div>
            <label htmlFor={id} className="label" > { children } </label> &nbsp;
            <input type={type} id={id} onChange={ handleSearch } value= { value } autoFocus = { true } className="input" />
        </div>
    )
  }