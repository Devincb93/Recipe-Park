import React, {useState} from 'react'

function Comments({comments, onAddComment}){
    const [newComment, setNewComment] = useState('');
    const handleCommentChange = (event) => {
        setNewComment(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (newComment.trim()) {
            onAddComment(newComment);
            setNewComment(''); 
        }
    };

    return (
        <div>
            <h3>Comments:</h3>
            {comments.length > 0 ? (
                <ul>
                    {comments.map((comment) => (
                        <li key={comment.id}>
                            <p>{comment.content}</p>
                            
                            <small>Posted on: {new Date(comment.created_at).toLocaleDateString()}</small>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No comments available.</p>
            )}
            <form onSubmit={handleSubmit}>
                <textarea
                    value={newComment}
                    onChange={handleCommentChange}
                    placeholder="Add a comment..."
                    rows="4"
                    cols="50"
                />
                <button type="submit">Add Comment</button>
            </form>
        </div>
    )
}

export default Comments