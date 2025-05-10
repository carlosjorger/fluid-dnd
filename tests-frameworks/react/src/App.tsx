import './App.css'
import NumberList  from './components/simpleNumberList';
import GroupOfNumberList from './components/groupOfNumberList';
import GroupOfPokemonlists from './components/groupOfPokemonlists';
function App() {

  return (
    <>
      <NumberList />
      <GroupOfNumberList />
      <GroupOfPokemonlists render={false} />
    </>
  )
}

export default App
