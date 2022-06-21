import {Link} from 'react-router-dom';
export default function Landing() {
  return (
    <div className="landingPage">
      <div className="reducer">
        <div className="center">
          <div className="title">rPHCraft</div>
          <p>Unofficial Minecraft server formed by active people at voice.</p>
          <div className="title">IP</div>
          <p>
            rphvccraft.capthndsme.xyz
            <br />
            Port 25565 if Java. Port 19132 if Bedrock.
          </p>
          <div className="title">Version</div>
          <p> 1.8 - 1.19 (Native 1.19)</p>

          <div className="title">Resources</div>
            <a target="_blank" href="https://map.rphvccraft.capthndsme.xyz/">Dynmap</a>
            <a target="_blank" href="https://discord.gg/philippines">Discord</a>
            <Link to="/chat/0">Web Chat BETA</Link>
          <div className="title">Rules</div>
          <p>
            Respect perimeters of others<br/>
            Do not steal from others.<br/>
            Do not grief!<br/>
            Give and take at the community centre.<br/>
            And of course, r/PH and r/PH discord rules apply here.
          </p>
          <div className="title">Discord?</div>
          <p>We're usually active at the Chit-chat voice chat messages.</p>
        </div>
      </div>
    </div>
  );
}
