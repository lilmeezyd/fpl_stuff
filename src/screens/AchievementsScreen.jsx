import { Container, Button, Spinner } from "react-bootstrap";
import GettingStartedMain from "../components/GettingStartedMain";
import CaptaincyMain from "../components/CaptaincyMain";
import RankingMain from "../components/RankingMain";
import ScoreMain from "../components/ScoreMain";
import { useState, useEffect, useReducer } from "react";
import axios from "axios";
const AchievementsScreen = () => {
  const [fplId, setFplId] = useState("");
  const [submitId, setSubmitId] = useState(localStorage.getItem('submitId') || null);
  const reducer = (state, action) => {
    if(action.type === 'started') {
      if(state.value === 'start' ) {
        return { value: ''}
      }
      return {
        value: 'start'
      }
    }
    if(action.type === 'captain') {
      if(state.value === 'cap') {
        return { value: ''}
      }
      return {
        value: 'cap'
      }
    }

    if(action.type === 'scoring') {
      if(state.value === 'score') {
        return { value: ''}
      }
      return {
        value: 'score'
      }
    }

    if(action.type === 'ranking') {
      if(state.value === 'rank') {
        return { value: ''}
      }
      return {
        value: 'rank'
      }
    }
  }
  const [state, dispatch] = useReducer(reducer, { value: ''})
  const { value } = state

  const useFetch = (dep) => {
    const [picks, setPicks] = useState([]);
    const [history, setHistory] = useState([]);
    const [manager, SetManager] = useState("");
    const [ error, setError] = useState("")
    useEffect(() => {
      const a = [];
      for (let i = 1; i <= 38; i++) {
        a.push(i);
      }
      const picksArray = a.map(
        (x) =>
          `https://corsproxy.io/?https://fantasy.premierleague.com/api/entry/${dep}/event/${x}/picks/`
      );
      async function makeAPICall(endpoint) {
        const response = await axios.get(endpoint);
        const data = await response.data;
        return data;
      }
      async function makeCalls(endpoints) {
        const promises = endpoints.map(makeAPICall);
        const responses = await Promise.all(promises);
        return responses;
      }
      const fetchData = async () => {
        try {
          const response = await makeCalls(picksArray);
          const response1 = await axios.get(
            `https://corsproxy.io/?https://fantasy.premierleague.com/api/entry/${dep}/history/`
          );
          const response2 = await axios.get(
            `https://corsproxy.io/?https://fantasy.premierleague.com/api/entry/${dep}/`
          );
          const data = await response1.data;
          const data1 = await response2.data;
          setHistory(data);
          setPicks(response);
          SetManager(data1);
          console.log(response);
        } catch (error) {
          const errMsg = error?.response?.data?.msg || error?.message;
          setError(errMsg)
          console.log(errMsg);
        }
      };

      dep >= 1 && fetchData();
    }, [dep]);
    return { picks, history, manager, error };
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitId(fplId);
    localStorage.setItem('submitId', fplId)
    setFplId(null);
  };

  const showCaptain = () => {
    dispatch({type:'captain'})
  }
  const showStarted = () => {
    dispatch({type: 'started'})
  }
  const showRank = () => {
    dispatch({type: 'ranking'})
  }
  const showScore = () => {
    dispatch({type: 'scoring'})
  }

  const { picks, history, manager, error } = useFetch(submitId);
  //console.log(picks);
  //console.log(history)

  if(!!submitId && picks.length === 0 && Object.keys(history).length === 0 && error === '') {
    return <Spinner />
  }

  return (
    <>
      <Container>
        {submitId === null && (
          <div className="form py-2">
            <form onSubmit={onSubmit}>
              <div className="fpl-id py-2">
                <label htmlFor="fplId">Enter FPL ID</label>
                <input
                  className="form-control"
                  type="number"
                  min={1}
                  id="fplId"
                  value={fplId}
                  onChange={(e) => setFplId(e.target.value)}
                />
              </div>
              <div className="py-2">
                <Button type="submit" className="fpl-id-btn btn-dark py-2">
                  Submit ID
                </Button>
              </div>
            </form>
          </div>
        )}

        {/*!!submitId && picks.length > 0 && Object.keys(history).length > 0 &&  */}

        {<div className="row">
          <div className="col-md-8 py-5">
            <div className="manager-stats-achieve mb-2">
            <div onClick={() => console.log('acievements')} className="ms-header py-2 m-3">Achievements</div>
            <div onClick={() => console.log('statistics')} className="ms-header py-2 m-3">Statistics</div>
            </div>
            

            <div className="achievements">
              <div open={!!(value === 'start')} className="details_1">
                <div onClick={showStarted}  className="summary">
                Getting Started
                </div>
                {value === 'start' && <GettingStartedMain picks={picks} />}
              </div>

              <div open={!!(value === 'cap')} className="details_1">
                <div onClick={showCaptain} className="summary">
                Captaincy
                </div>
                {value === 'cap' && <CaptaincyMain picks={picks} />}
              </div>

              <div open={!!(value === 'rank')} className="details_1">
                <div onClick={showRank} className="summary">
                Gameweek Ranking
                </div>
                {value === 'rank' && <RankingMain history={history} />}
              </div>

              <div open={!!(value === 'score')} className="details_1">
                <div onClick={showScore} className="summary">
                Gameweek Score
                </div>
                {value === 'score' && <ScoreMain history={history} />}
              </div>
            </div>
          </div>

          <div className="py-5 col-md-4">
            <div className="manager-wrap">
              <div className="manager-header">Manager:</div>
              <div className="manager-data">
                {manager?.player_first_name} {manager?.player_last_name}
              </div>
            </div>
            <div  className="manager-wrap">
              <div className="manager-header">Team Name:</div>
              <div className="manager-data">{manager?.name}</div>
            </div>
            <div  className="manager-wrap">
              <div className="manager-header">Overall Rank</div>
              <div className="manager-data">{manager?.summary_overall_rank}</div>
            </div>
            <div  className="border">
            <Button onClick={(e) => {
              e.preventDefault()
              localStorage.removeItem('submitId')
              setSubmitId(null)
            }} className="py-2 btn-dark" style={{width: 100+'%'}}>Change FPL ID</Button>
            </div>
          </div>
        </div>}
      </Container>
    </>
  );
};

export default AchievementsScreen;
