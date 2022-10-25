const ArrayFieldTemplate = () => {
    return (
      <div>
        {items.map(element => element.children)}
        {canAdd && <button type="button" onClick={onAddClick}></button>}
      </div>
    );
  }

export default ArrayFieldTemplate;