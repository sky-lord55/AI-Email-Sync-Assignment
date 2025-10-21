import react from 'react'

import {useEffect,useState} from 'react'

function EmailList(){
    const [emails,setEmails] = useState([])
    const [query,setQuery] = useState([])
    const [folder,setFolder] = useState([])
    const [account,setAccount] = useState([])

    useEffect(()=>{
        AudioParam.searchEmails(query,folder,account).then(setEmails),[query,folder,account]
    })

    return(
        <div>
            <input placeholder="Search Emails" onChange={e => setQuery(e.target.value)}/>

            <select onChange={e => setFolder(e.target.value)}>
                <option value="">All Folders</option>
                <option value="Inbox">Inbox</option>
                <option value="Sent">Sent</option>
            </select>
            <select onChange={e => setAccount(e.target.value)}>
                <option value="">All Accounts</option>
                <option value="user1email.com">User-1</option>
                <option value="user2email.com">User-2</option>
            </select>
            <ul>
                {emails.map(email =>(
                    <li key={email.messageId}>
                        <strong>{email.subject}</strong>
                    </li>
                ))}
            </ul>
        </div>
    )
}
export default EmailList