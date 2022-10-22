const ArrayFieldTemplate = (obj) => {
    Object.keys(obj).forEach(key => {

        const prop = obj[key]
        if (prop.probe_streams!==undefined) {
            const stream = prop.probe_streams.items
            console.log(stream.$ref) // string
            const coords = stream.properties //undefined
            //TODO: access the coordinates thru properties (figure out how to do that with the $refs)
            /*Object.keys(coords).forEach(key => {
                console.log(key)
             })*/
        }
      })
}

export default ArrayFieldTemplate;

