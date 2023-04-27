export const ExpressionHint = () => {
    return (
        <div>
            <p> eg. value * value + 1 </p>
            <p> eg. Math.floor(value * 3.25) </p>
            <p> eg. value &lt;= 5 ? value * 2 : value * 3 </p>
        </div>
    )
}

export const NameHint = () => {
    return (
        <div>
            Name is used to identify the template. It is not displayed on the card.<br />
            Duplicate name will be removed when importing.
        </div>
    )
}