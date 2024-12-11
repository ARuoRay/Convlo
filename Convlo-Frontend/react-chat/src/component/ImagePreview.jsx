
function ImagePreview({imageUrl}){
    return(
        <div>
            {imageUrl &&(
                <div>
                    <img src="{imageUrl}" alt="預覽"  style={{ maxWidth: "100%", maxHeight: "300px", objectFit: "contain" }}/>
                </div>
            )}
        </div>
    )
}

export default ImagePreview;