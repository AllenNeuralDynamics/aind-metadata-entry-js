export default async function fetchSchema (props) {
    /*
    Functional component to fetch schemas from aws s3 bucket
    */
    const response = await fetch('https://aind-data-schema-dev.s3.us-west-2.amazonaws.com', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',

        }
    })
    const responseText = await response.text()
    console.log(responseText)
    const parser=new DOMParser();
    const xmlParsed = parser.parseFromString(responseText, 'text/xml');
    console.log(xmlParsed)
    var schema_links = []
    const elements = xmlParsed.getElementsByTagName("Key");
    for (var i=0; i < elements.length; i++) {
        schema_links[i] = elements[i].innerHTML
    }
    console.log(schema_links)
}
