import React from "react";
import logo from "./logo.svg";
import "./App.css";

const url = "http://dummix.cf/match/get_views.php";
const domain = "https://newsapi.org";
const key = "0f023bbace9f4c85bc59fcaa4b77804d";
function getUrl(data, type) {
    return `${domain}/v2/top-headlines?${type}=${data}&apiKey=${key}`
}

function Page(props) {
    const comps = props.data.articles.map((article, i) => {
        return (
            <div key={i} style={{ borderWidth: "0 0 5px 0", borderStyle: "solid", borderColor: "red" }}>
                <div>
                    <img src={article.urlToImage} alt={article.title} />
                </div>
                <div>
                    <p><a href={article.url}>{article.title}</a></p>
                    <p>{article.description}</p>
                </div>
            </div>
        );
    });
    return (
        <div>{comps}</div>
    );
}

class App extends React.Component {

    state = {
        state: "loading",
        data: [],
        query: "",
        category: "general"
    };

    componentDidMount() {
        this.loadData(this.state.category);
    }

    handleSubmit = (evt) => {
        evt.preventDefault();
        // alert(this.state.query);
        this.loadData(this.state.query, "q");
    }

    handleCategory = (cat) => (evt) => {
        evt.preventDefault();
        // alert(cat);
        this.loadData(cat, "category");
    }

    loadData = (data, type = "category") => {

        this.setState({ state: "loading", category: data });
        fetch(getUrl(data, type))
            .then(res => res.json())
            .then(json => {
                console.log(json);
                this.setState({ state: "loaded", data: json });
            })
            .catch(err => {
                console.log(err);
                this.setState({ state: "failed" });
            });
    }


    render() {
        let comp;
        switch (this.state.state) {
            case "loading": comp = <div>Loading ...</div>; break;
            case "loaded": comp = <div>{<Page data={this.state.data} />}</div>; break;
            case "failed": comp = <div>Failed</div>; break;
        }

        return (
            <div className="container">
                <div className="row">
                    <form onSubmit={this.handleSubmit}>
                        <input
                            type="text"
                            name="query"
                            value={this.state.query}
                            onChange={(e) => {
                                this.setState({ query: e.target.value });
                            }}
                        />
                        <button>Search</button>
                    </form>
                </div>
                <div className="row">
                    <div className="col"><a href="#" onClick={this.handleCategory("general")} >General</a></div>
                    <div className="col"><a href="#" onClick={this.handleCategory("sports")} >Sports</a></div>
                    <div className="col"><a href="#" onClick={this.handleCategory("entertainment")} >Entertainment</a></div>
                    <div className="col"><a href="#" onClick={this.handleCategory("business")} >Business</a></div>
                    <div className="col"><a href="#" onClick={this.handleCategory("technology")} >Technology</a></div>
                </div>
                <div className="row">
                    {comp}
                </div>
            </div>
        );
    }
}

export default App;
