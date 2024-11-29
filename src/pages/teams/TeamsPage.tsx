import {useEffect, useState} from "react";
import {fetchTeams} from "../../api/api.ts";
import {Team} from "../../api/types.ts";

export const TeamsPage = () => {
  const [teams, setTeams] = useState<Team[]>([])

  useEffect(() => {
    fetchTeams().then(
      (teams) => setTeams(teams)
    )
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
