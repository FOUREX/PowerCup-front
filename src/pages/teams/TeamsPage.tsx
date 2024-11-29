import {useEffect, useState} from "react";
import {get_teams} from "../../api/api.ts";

export const TeamsPage = () => {
  const [teams, setTeams] = useState([])


  const fetchTeams = async () => {
    setTeams(await get_teams())
  }

  useEffect(() => {
    fetchTeams().catch(console.error)
  }, [])

  return (
    <div className="content flex h-screen">
      <div className="mx-auto my-auto">
        <table className="border-collapse" border="1px solid black">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Members</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr>
                <td>{team.id}</td>
                <td>{team.name}</td>
                <td>{JSON.stringify(team.members)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
