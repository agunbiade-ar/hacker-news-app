import { useState } from 'react'
import './ListComponent.css'
import { sortBy } from 'lodash'

const ItemComponent = ( { item, onRemoveItem } ) => {

  return (
        <div className="item">           
              <span style={ {width: '40%'} }> <a href={item.url}>{item.title}</a>  </span>
              <span style={ {width: '30%'} }>{item.author}</span>
              <span style={ {width: '10%'} }>{item.num_comments}</span>
              <span style={ {width: '10%'} }>{item.points}</span>
              <button className="button button-small" onClick={() => onRemoveItem(item) }> Remove Item</button>
              <hr />
        </div>
    )
}

export function List( { list, onRemoveItem } ){

  const SORTS = {
    NONE: list => list,
    TITLE: list => sortBy(list, 'title'),
    AUTHOR: list => sortBy(list, 'author'),
    COMMENT: list => sortBy(list, 'num_comments').reverse(),
    POINT: list => sortBy(list, 'points').reverse()
  }
  
  const [sort, setSort] = useState( {sortKey: 'NONE', isReverse: false} )  
  
  const handleSort = ( sortKey ) => {
      const isReverse = sort.sortKey === sortKey && !sort.isReverse
      setSort( { sortKey, isReverse} )
  }

  const sortFunction = SORTS[sort.sortKey]
  const sortedList = sort.isReverse ? sortFunction( list ).reverse() : sortFunction(list)

    return (
      <div>
          <div style={{ display: 'flex', fontWeight: 'bold' }}>
            <span style={{ width: '40%' }}> <button onClick={ ()=> handleSort('TITLE') }>  Title </button></span>
            <span style={{ width: '30%' }}> <button onClick={ ()=> handleSort('AUTHOR') }>  Author </button></span>
            <span style={{ width: '10%' }}> <button onClick={ ()=> handleSort('COMMENT') }>  Comments </button></span>
            <span style={{ width: '10%' }}> <button onClick={ ()=> handleSort('POINT') }>  Points </button></span>
        </div>
        {
          sortedList.map( (story, index) => <ItemComponent key = {story.objectID + index} item={ story } onRemoveItem = { onRemoveItem }/>
          )
        }
    </div>
    )
  }