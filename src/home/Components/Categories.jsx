import React from 'react'
import './categories.css';
import table from '../assets/table.svg'
import paint from '../assets/paint.svg'
import bor from '../assets/bor.svg'
import mdi from '../assets/mdi.svg'
import maki from '../assets/maki.svg'
import sicon from '../assets/sicon.svg'
import arrow from '../assets/arrow-down.svg'


const Categories = () => {
  return (
    <section className='categories'>
        <div className="categories-hero">
            <h2 style={{fontSize: "2rem"}}>Kateqoriyalar</h2>
            <p style={{ display: "flex", alignItems:"center", gap:"10px" }}>Daha Cox <img src={arrow} alt="arrow-right" style={{ rotate:"-90deg", width:"20px" }} /></p>
        </div>
        <div className="main-categories">
            <div className="category1">
                <img src={table} alt="Category 1" className='category-img' />
                <div className="worker-data">
                <h2>Mebel yığımı</h2>
                <p>90+ Usta</p>
                </div>
            </div>
            <div className="category1">
                <img src={paint} alt="Category 2" className='category-img' />
                <div className="worker-data">
                <h2>Rəngsaz</h2>
                <p>150+ Usta</p>
                </div>
            </div>
            <div className="category1">
                <img src={bor} alt="Category 3" className='category-img' />
                <div className="worker-data">
                <h2>Santexnik</h2>
                <p>400+ Usta</p>
                </div>
            </div>
            <div className="category1">
                <img src={mdi} alt="Category 4" className='category-img' />
                <div className="worker-data">
                <h2>Təmir və tikinti</h2>
                <p>360+ Usta</p>
                </div>
            </div>
            <div className="category1">
                <img src={maki} alt="Category 3" className='category-img' />
                <div className="worker-data">
                <h2>Mexanik</h2>
                <p>760+ Usta</p>
                </div>
            </div>
            <div className="category1">
                <img src={sicon} alt="Category 4" className='category-img' />
                <div className="worker-data">
                <h2>Derzi</h2>
                <p>566+ Usta</p>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Categories
