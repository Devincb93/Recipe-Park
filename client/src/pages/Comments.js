import React, { useContext, useState } from 'react';
import { MyContext } from '../MyContext';

function CommentForm({ recipeId, setComments }) {
    const { user } = useContext(MyContext)
    const [newComment, setNewComment] = useState('');

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/addcomment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recipe_id: recipeId,
                    user_id: user.id,
                    content: newComment,
                }),
            });
            if (response.ok) {
                setNewComment('');
                
                const updatedCommentsResponse = await fetch(`/comments/recipe/${recipeId}`);
                const updatedComments = await updatedCommentsResponse.json();
                setComments(prevComments => ({
                    ...prevComments,
                    [recipeId]: updatedComments,
                }));
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <form onSubmit={handleCommentSubmit}>
            <textarea 
                value={newComment} 
                onChange={(e) => setNewComment(e.target.value)} 
                placeholder="Add a comment" 
            />
            <button type="submit">Submit</button>
        </form>
    );
}

export default CommentForm;