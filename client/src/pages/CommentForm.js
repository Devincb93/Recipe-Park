import React, { useContext, useState } from 'react';
import { MyContext } from '../MyContext';
function CommentForm({ recipeId, onCommentAdded }) {
    const { user } = useContext(MyContext)
    const [content, setContent] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recipe_id: recipeId,
                    user_id: user.id,
                    content: content,
                }),
            });

            if (response.ok) {
                setContent('');
                onCommentAdded(recipeId); 
            } else {
                console.error('Error adding comment:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
            />
            <button type="submit">Add Comment</button>
        </form>
    );
}

export default CommentForm;