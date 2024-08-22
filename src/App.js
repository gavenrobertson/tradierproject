import React from 'react';
import './App.css';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import logo_seal from './imgs/seal-color-transparent.png'
import ParticleBackground from "./ParticlesContainer";

function App() {
    const { register, handleSubmit } = useForm();
    const [accounts, setAccounts] = useState([]);
    const [total, setTotal] = useState(0.0);
    const [equities, setEquities] = useState([]);
    const [loading, setLoading] = useState(false); // Add a loading state
    const [error, setError] = useState(false);
    let userName = ""

    const getBalances = async (data) => {
        let runningTotalEquity = 0;
        setLoading(true);

        if (data.access_token === '') {
            setLoading(false)
            setError(true);
            return;
        }

        try {
            const response = await fetch('https://api.tradier.com/v1/user/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${data.access_token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                console.log("Error, something wrong with accounts request");
                return;
            }

            const responseData = await response.json();
            const accountNumbers = responseData.profile.account.map(account => account.account_number);
            setAccounts(accountNumbers);
            userName = responseData.profile.name;

            // Fetch balances for each account and update equities state
            const totalBalance = accountNumbers.map(async (account_id) => {
                const balanceResponse = await fetch(`https://api.tradier.com/v1/accounts/${account_id}/balances`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${data.access_token}`,
                        'Accept': 'application/json'
                    }
                });

                if (balanceResponse.ok) {
                    const balanceData = await balanceResponse.json();
                    const equity = parseFloat(balanceData.balances.total_equity) || 0;
                    runningTotalEquity += equity;

                    // Update equities state
                    setEquities(prevEquities => [...prevEquities, { account_number: account_id, account_equity: equity }]);
                    // console.log(equities)
                } else {
                    console.log("Error, something wrong with request");
                }
            });

            await Promise.all(totalBalance);
            setLoading(false);

            // Update total state
            setTotal(runningTotalEquity);

        } catch (error) {
            console.error(error);
        }


    };

    return (
        <>
            <ParticleBackground/>
            <div className="App">
                <div className="header-container">
                    <img className="logo-seal" src={logo_seal} alt="logo" />
                    <h1>Tradier Account Wizard</h1>
                </div>
                <div>
                    <h2 className="intro">Welcome! Please enter in your API Access Token to see the total balance from all your accounts.</h2>
                </div>
                <div className="content-container">
                    <form className="submit-form con-item1" onSubmit={handleSubmit(getBalances)}>
                        <label>Enter your API Access Token:</label>
                        <input
                            type="text"
                            name="access_token"
                            {...register('access_token')}
                            onChange={() => {
                                if (error) {
                                    setError(false); // Clear error when user starts typing
                                }
                            }}
                        />
                        <button className={error === true ? "error_btn" : "form_btn"} disabled={loading || error} type="submit">
                            {loading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    <span className="visually-hidden">Loading...</span>
                                </>
                            ) : error ? ('Error! Please Try Again!') : ('Submit')}

                        </button>
                    </form>
                    <div className="equity-container con-item2">
                        <h2 className="h2_account_heading">Account Information:</h2>
                        <ul className="account_list">
                            {equities.map(equity => (
                                <li key={equity.account_number}><span className="equity_account_number">{equity.account_number}</span>: <span
                                    className="dollar-sign">$</span>{equity.account_equity.toFixed(2)}</li>
                            ))}
                        </ul>
                        <h4>Total Equity: <span className="dollar-sign">$</span>{total.toFixed(2)}</h4>
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;