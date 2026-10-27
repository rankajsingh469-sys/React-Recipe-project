import axios from 'axios';
import React, { useEffect, useState } from 'react';
import RecipeCard from '../Components/RecipeCard.jsx';
import Footer from '../Components/Footer';


function Home() {

  const [recipes, setRecipes] = useState([]);
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false);
  const [searchQuery , setSearchQuery] = useState("")


function handleSearch(e){
  e.preventDefault();
  const form = new FormData(e.target);
  const query = form.get("query").trim();
  setSearchQuery(query);
  if(query){
    console.log(query);
    fetchRecipes(0 , query)
  }
}

  async function fetchRecipes(skipCount , query) {
    try {
      let url = `https://dummyjson.com/recipes?limit=6&skip=${skipCount}`
      if(query){
         url = `https://dummyjson.com/recipes/search?limit=6&skip=${skipCount}&q=${encodeURIComponent(query)}`;
      }
      const { data } = await axios.get(url);
      
      setLoading(false)
      setRecipes((prev) => skipCount === 0 ? data.recipes : [...prev, ...data.recipes])
      setTotal(data.total)
    } catch (error) {
      setLoading(false)
      setError(true)

    }
  }


  useEffect(() => {
    fetchRecipes(0)
  }, [])


  if (loading) {
    return (
      <p className='text-center pt-6'>Loading...</p>
    )
  }


  if (error) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-16 text-center ">
        <h1 className="font-serif text-5xl font-bold text-accent mb-2">404</h1>

        <img className='mx-auto' src="https://www.gstatic.com/youtube/src/web/htdocs/img/monkey.png" alt="" />
        <h2 className="text-xl font-semibold mb-3">Failed to load recipes</h2>
        <p className="text-muted mb-6">Something went wrong. Please try again.</p>

      </main>
    )
  }




  return (
    <>
      <main className="max-w-6xl mx-auto px-4 py-8">

        <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto mb-8">
          <input
            type="text"
            name='query'
            placeholder="Search recipes..."
            className="flex-1 border border-border rounded px-3 py-2 bg-card text-text outline-none focus:border-accent"
          />
          <button type="submit" className="bg-accent hover:bg-accent-hover text-white rounded px-4 py-2 font-medium">
            Search
          </button>
        </form>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>

         {!loading && recipes.length === 0 && (
        <p className="text-center py-6 text-muted">{`No recipes found for '${searchQuery}'`}</p>
      )}

        {recipes.length < total && <div className="text-center mt-8">
          <button
            type="button"
            className="bg-accent cursor-pointer hover:bg-accent-hover text-white rounded px-6 py-2 font-medium"

            onClick={() => fetchRecipes(recipes.length , searchQuery)}
          >
            Load More
          </button>
        </div>
        }
      </main>
      <Footer />
    </>
  );
}

export default Home;  