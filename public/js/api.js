export function getAll(tablename){
    $.getJSON( "http://localhost:5000/api/"+ tablename, function( result ) {
            return result;
    });
}